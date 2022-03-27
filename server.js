const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require("./helpers/uuid");
const app = express();
//created a server
const PORT = process.env.PORT || 3001;
//note empty array
//var createList = [];

//middleware or parsing json
app.use(express.static("public"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
// GET route to get all of the notes
app.get("/notes", (req, res) => {
  console.log("return notes.html");
  res.sendFile(path.join(__dirname, "/public", "notes.html"));
});

app.get("/", (req, res) => {
  console.log("return index.html");
  res.sendFile(path.join(__dirname, "/public", "index.html"));
});

//return all notes
app.get("/api/notes", (req, res) => {
  console.log("return notes as json");
  fs.readFile("./db/db.json", "utf-8", function (err, data) {
    res.send(JSON.parse(data));
  });
});

//POST. add new notes to the array
app.post("/api/notes", (req, res) => {
  if (req.body) {
    const newNote = {
      id: uuid(),
      title: req.body.title,
      text: req.body.text,
    };

    updatedNotesDB(addNote, newNote);
    res.send("add successful");
  }
});

//delete notes
app.delete("/api/notes/:id", (req, res) => {
  console.log("DELETE note with id: " + req.params.id);
  updatedNotesDB(removeNote, req.params.id);
  res.send("delete successful");
});

function addNote(noteList, note) {
  noteList.push(note);
}

function removeNote(noteList, noteId) {
  for (var i = 0; i < noteList.length; i++) {
    if (noteList[i].id === noteId) {
      noteList.splice(i, 1);
      return;
    }
  }
}

const updatedNotesDB = (updateDataFunc, param) => {
  const data = fs.readFileSync("./db/db.json");
  const noteList = JSON.parse(data);

  updateDataFunc(noteList, param);

  fs.writeFileSync("./db/db.json", JSON.stringify(noteList));
  //res.send("delete successful");
};
//port
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
