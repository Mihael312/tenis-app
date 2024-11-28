import express from "express";
import db from "../index.js"; // Import database connection

const router = express.Router();

// Get all sessions
router.get("/", (req, res) => {
  const select = req.query.columns ? req.query.columns : "*";
  db.query(`SELECT ${select} FROM sessions`, (err, results) => {
    if (err) {
      console.error("Error fetching sessions:", err);
      res.status(500).send("Failed to fetch sessions");
    } else {
      res.json(results);
    }
  });
});

// Insert new session
router.post("/add", (req, res) => {
  const session = req.body;
  console.log(session)
  db.query(
    "INSERT INTO sessions (Username, UserLastName, StartTime, EndTime) VALUES (?, ?, ?, ?)",
    [session.username, session.userLastName, session.StartTime, session.endTime],
    (err, result) => {
      if (err) {
        console.error("Error inserting session:", err);
        res.status(500).json({ message: "Failed to add session", error: err });
      } else {
        res.status(201).json({
          message: `Session added successfully with ID: ${result.insertId}`,
          sessionId: result.insertId
        });
        console.log(`session added with ID: ${result.insertId}`);
      }
    }
  );
});


export default router;
