import express from "express";
import supabase from "../supabaseClient.js";

const router = express.Router();

// Get all sessions
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase.from('sessions').select('*');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Error fetching sessions:", err);
    res.status(500).send("Failed to fetch sessions");
  }
});

// Insert a new session
router.post("/add", async (req, res) => {
  const { username, userLastName, startTime, endTime } = req.body;

  // Validate the request body
  if (!username || !userLastName || !startTime || !endTime) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const { data, error } = await supabase
      .from('sessions')
      .insert({ username, userLastName, startTime, endTime })
      .select('id'); // Use select to return specific fields like id

    if (error) throw error;

    // Ensure data is not empty
    if (!data || data.length === 0) {
      return res.status(500).json({ error: "Session could not be added" });
    }

    res.status(201).json({
      message: "Session added successfully",
      sessionId: data[0].id,
    });
  } catch (err) {
    console.error("Error inserting session:", err);
    res.status(500).json({ error: "Failed to add session" });
  }
});


export default router;
