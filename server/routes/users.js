import express from "express";
import db from "../index.js"; // Import database connection

const router = express.Router();

// User Registration
router.post("/add", async (req, res) => {
  const { username, lastname, email, password } = req.body;

  if (!username || !lastname || !email || !password) {
    return res
      .status(400)
      .json({ error: "Username, lastname and password are required" });
  }

  // Check if username exists
  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        console.error("Error checking username:", err);
        return res.status(500).json({ error: "Failed to check username" });
      }

      if (results.length > 0) {
        return res.status(409).json({ error: "email already taken" });
      }

      // Directly store the password as plain text for testing
      db.query(
        "INSERT INTO users (username, lastname, email, password) VALUES (?, ?, ?, ?)",
        [username, lastname, email, password],
        (err, result) => {
          if (err) {
            console.error("Error inserting user:", err.message);
            return res.status(500).json({ error: "Failed to add user" });
          }
          return res
            .status(201)
            .json({ message: `User added with ID: ${result.insertId}` });
        }
      );
    }
  );
});

// User Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Email and password are required." });
  }

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        console.error("Error querying the database:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length > 0) {
        // Compare stored password with the input password
        if (results[0].password === password) {
          const { password, ...userDetails } = results[0]; // Exclude password
          return res
            .status(200)
            .json({ message: "Login successful", username: userDetails.username, lastname: userDetails.lastname });
        } else {
          return res
            .status(401)
            .json({ error: "Invalid email or password" });
        }
      } else {
        return res.status(401).json({ error: "Invalid email or password" });
      }
    }
  );
});

// Get all users
router.get("/", (req, res) => {
  const select = req.query.columns ? req.query.columns : "*";
  db.query(`SELECT ${select} FROM users`, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      res.status(500).send("Failed to fetch users");
    } else {
      res.json(results);
    }
  });
});

// Update a user
router.put("/update/:name", (req, res) => {
  const { name } = req.params;
  const { email } = req.body;

  // Simple validation for email
  if (!email) {
    return res.status(400).send("Email is required for update");
  }

  db.query(
    "UPDATE users SET email = ? WHERE username = ?",
    [email, name],
    (err, result) => {
      if (err) {
        console.error("Error updating user:", err);
        res.status(500).send("Failed to update user");
      } else {
        if (result.affectedRows === 0) {
          return res.status(404).send(`User ${name} not found`);
        }
        res.send(`User ${name} updated`);
      }
    }
  );
});

// Delete a user
router.delete("/delete/:name", (req, res) => {
  const { name } = req.params;
  db.query("DELETE FROM users WHERE username = ?", [name], (err, result) => {
    if (err) {
      console.error("Error deleting user:", err);
      res.status(500).send("Failed to delete user");
    } else {
      if (result.affectedRows === 0) {
        return res.status(404).send(`User ${name} not found`);
      }
      res.send(`User ${name} deleted`);
    }
  });
});

export default router;
