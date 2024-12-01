import express from "express";
import supabase from "../supabaseClient.js";

const router = express.Router();

// Add a new user
router.post("/add", async (req, res) => {
  const { username, lastname, email, password } = req.body;

  if (!username || !lastname || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if email already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id') // Only select the ID to reduce payload size
      .eq('email', email)
      .maybeSingle(); // Avoid throwing an error if no matching rows exist

    if (checkError) {
      console.error("Error checking existing user:", checkError);
      return res.status(500).json({ error: "Error checking existing user" });
    }

    if (existingUser) {
      return res.status(409).json({ error: "Email already exists" });
    }

    // Insert new user
    const { data, error } = await supabase
      .from('users')
      .insert({ username, lastname, email, password })
      .select('id'); // Return the inserted ID

    if (error) {
      console.error("Error inserting user:", error);
      return res.status(500).json({ error: "Failed to add user" });
    }

    res.status(201).json({ message: "User added successfully", userId: data[0]?.id });
  } catch (err) {
    console.error("Unexpected error adding user:", err);
    res.status(500).json({ error: "Unexpected error occurred while adding user" });
  }
});


// User Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) throw error;

    if (user.password === password) {
      const { password, ...userDetails } = user; // Exclude password
      res.json({ message: "Login successful", ...userDetails });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
