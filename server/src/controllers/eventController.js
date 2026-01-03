import { executeQuery } from "../config/database.js";
import { v4 as uuidv4 } from "uuid";

// Create a New Event
export const createEvent = async (req, res) => {
  try {
    const { title, description, event_date, location, event_photo } = req.body; 
    const adminId = req.user.userId; // Get the ID of the logged-in Admin

    // the title and date are present
    if (!title || !event_date) {
      return res.status(400).json({ 
        success: false, 
        message: "Title and Event Date are required." 
      });
    }

    const eventId = uuidv4(); // a unique ID

     const query = `
      INSERT INTO events (id, title, description, event_date, location, created_by, event_photo) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await executeQuery(query, [
      eventId,
      title,
      description,
      event_date,
      location,
      adminId,
      event_photo,
      event_photo,
    ]);

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: { eventId, title }
    });
  } catch (error) {
    console.error("Create event error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to create event", 
      error: error.message 
    });

  }
};

// 2. Get events to show 
export const getEvents = async (req, res) => {
  try {
    const query = `
      SELECT e.*, u.firstName as creatorName 
      FROM events e 
      JOIN users u ON e.created_by = u.id 
      ORDER BY e.event_date ASC
    `;
    const events = await executeQuery(query);

    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch events" });
  }
};