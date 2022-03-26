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
    //console.log("data", JSON.parse(data));
    res.send(JSON.parse(data));
  });
});

//POST. add new notes to the array
app.post("/api/notes", (req, res) => {
  console.log(req.body);

  if (req.body) {
    const newNote = {
      id: uuid(),
      title: req.body.title,
      text: req.body.text,
    };
    console.log(newNote);
    readAndAppend(newNote, "./db/db.json");
  }
});

const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );
const readAndAppend = (content, file) => {
  fs.readFile(file, "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};
//delete notes
app.delete("/api/notes/:id", (req, res) => {
  console.log("DELETE note with id: " + req.params.id);
  updateNotesDb();
});

const updateNotesDb = () => {
  const data = fs.readFileSync("./db/db.json");
  const noteList = JSON.parse(data);

  let updatedNoteList = noteList.filter((note) => {
    return note.id !== req.params.id;
  });

  fs.writeFileSync("./db/db.json", JSON.stringify(updatedNoteList));
  res.send("delete successful");
};

//port
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
