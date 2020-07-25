// Dependencies
// =============================================================
const express = require("express");
const fs = require("fs");
const path = require('path');

// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 3010;
const dir = path.join(__dirname, "/public");

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// API ROUTES

// Retrieve saved Data
app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

let savedData = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));

// Add new note
app.post("/api/notes", function(req, res) {
    let newNote = req.body;
    let assignID = (savedData.length + 1);
    newNote.id = assignID;
    savedData.push(newNote);

    fs.writeFileSync("db/db.json", JSON.stringify(savedData,'\t'));
    console.log("New note added: " + newNote.title);
    res.json(savedData);
});

// Delete existing note
app.delete("/api/notes/:id", function(req, res) {
    savedData;
    const currID = req.params.id;

    // Delete selected note
    const deleteNote = new Promise((resolve, reject) => {
        resolve(savedData.splice(currID - 1, 1));
        console.log("Note id " + currID + " has been deleted.");
    });

    // Reset note id
    deleteNote.then(() => {
        let noteID = 1;
        for (eachNote of savedData) {
            eachNote.id = noteID;
            noteID++;
        }
    });

    fs.writeFileSync("db/db.json", JSON.stringify(savedData,'\t'));
    res.json(savedData);
});

// HTML Routes
app.get('/notes', function(req,res) {
    res.sendFile(path.join(dir, "notes.html"));
});

app.get('*', function(req,res) {
    res.sendFile(path.join(dir, "index.html"));
});

// Setup listener
app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
});
