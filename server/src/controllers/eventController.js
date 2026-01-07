import { executeQuery } from "../config/database.js";
import { v4 as uuidv4 } from "uuid";

// Create a New Event
export const createEvent = async (req, res) => {
  try {
    const { title, description, event_date, location, type } = req.body; 
    const event_photo = req.file ? `/uploads/${req.file.filename}` : null;
    const adminId = req.user.userId; 

    
    if (!title || !event_date) {
      return res.status(400).json({ 
        success: false, 
        message: "Title and Event Date are required." 
      });
    }

    const eventId = uuidv4(); 

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
      type || 'In - person'
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



// 3. Updating an event
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, location, event_date, type } = req.body;

    console.log(`--- ADMIN EVENT UPDATE: ${id} ---`);

    let query = `
      UPDATE events 
      SET title = ?, 
          description = ?, 
          location = ?, 
          event_date = ?, 
          type = ?, 
          updatedAt = NOW()
    `;
    let params = [title, description, location, event_date, type];

    
    if (req.file) {
      const photo_path = `/uploads/${req.file.filename}`;
      query += ", event_photo = ?";
      params.push(photo_path);
    }

    query += " WHERE id = ?";
    params.push(id);

    const result = await executeQuery(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }

    res.json({ 
      success: true, 
      message: "✨ Event updated successfully!" 
    });

  } catch (error) {
    console.error("SQL UPDATE ERROR:", error.message);
    res.status(500).json({ success: false, message: "Update failed", error: error.message });
  }
};