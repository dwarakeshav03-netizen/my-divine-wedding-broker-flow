import { executeQuery } from "../config/database.js";

// 1. Get all stories 
export const getAllStories = async (req, res) => {
  try {
    const stories = await executeQuery("SELECT * FROM success_stories ORDER BY wedding_date DESC");
    res.json({ success: true, data: stories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch stories" });
  }
};

// 2. Create a new story 
export const createStory = async (req, res) => {
  try {
    const { couple_name, location, wedding_date, story_photo, quote, full_story } = req.body;
    const countResult = await executeQuery("SELECT COUNT(*) as total FROM success_stories");
    const nextCount = countResult[0].total + 1;
    const nextId = `s${nextCount}`; 
    
    await executeQuery(
      "INSERT INTO success_stories (id, couple_name, location, wedding_date, story_photo, quote, full_story) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [nextId, couple_name, location, wedding_date, story_photo, quote, full_story]
    );

    res.status(201).json({ 
      success: true, 
      message: "Story published successfully!", 
      id: nextId 
    });
  } catch (error) {
    console.error("Create story error:", error);
    res.status(500).json({ success: false, message: "Failed to create story", error: error.message });
  }
};

// 3. Update an existing story 
export const updateStory = async (req, res) => {
  try {
    const { id } = req.params;
    const { couple_name, location, wedding_date, story_photo, quote, full_story } = req.body;

    await executeQuery(
      "UPDATE success_stories SET couple_name=?, location=?, wedding_date=?, story_photo=?, quote=?, full_story=? WHERE id=?",
      [couple_name, location, wedding_date, story_photo, quote, full_story, id]
    );

    res.json({ success: true, message: "Story updated successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Update failed" });
  }
};