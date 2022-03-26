const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
//created a server
const PORT = process.env.PORT || 3001;
//note empty array
var noteList = [];

//middleware
app.use(express.static("public"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
// GET route to get all of the notes
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public", "/notes.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public", "index.html"));
});
app.get("/api/notes", () => {
  fs.readFile("./db/db.json", "utf-8", function (err, data) {
    console.log("data", JSON.parse(data));
  });
});
//POST
app.post("api/notes", function () {});

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
