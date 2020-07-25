// Dependencies
// =============================================================
const express = require("express");
const fs = require("fs");
const path = require('path');

// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

fs.readFile("db/db.json","utf8", (err, data) => {

    if (err) throw err;

    app.get('*', function(req,res) {
        res.sendFile(path.join(__dirname, "./public/index.html"));
    });

    app.get('/notes', function(req,res) {
        res.sendFile(path.join(__dirname, "./public/notes.html"));
    });

    const notes = JSON.parse(data);

    // API ROUTES
    app.get("/api/notes", function(req, res) {
        res.json(notes);
    });

    app.post("/api/notes", function(req, res) {
        let newNote = req.body;
        notes.push(newNote);
        updateDb();
        return console.log("Added new note: " + newNote.title);
    });

    app.get("/api/notes/:id", function(req,res) {
        res.json(notes[req.params.id]);
    });

    app.delete("/api/notes/:id", function(req, res) {
        notes.splice(req.params.id, 1);
        updateDb();
        console.log("Deleted note with id "+req.params.id);
    });

    function updateDb() {
        fs.writeFile("db/db.json",JSON.stringify(notes,'\t'),err => {
            if (err) throw err;
            return true;
        });
    }

});

// Setup listener
app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
});
