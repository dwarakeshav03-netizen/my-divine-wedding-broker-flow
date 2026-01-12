import { executeQuery } from "../config/database.js";
import { hashPassword } from "../utils/passwordUtils.js";
import { v4 as uuidv4 } from "uuid";

export const seedDatabase = async (req, res) => {
    try {
        const GROOMS = ["Subash", "Thanush", "Kotai", "Ramesh", "Vijay", "Sribala", "Mukesh", "Umasankar"];
        const BRIDES = ["Divya", "Karthika", "Gowri", "Dhanya", "Leelavathi", "Gayathri"];

        const hashedPassword = await hashPassword("password123");

        for (const name of GROOMS) {
            await executeQuery(
                "INSERT INTO users (id, firstName, email, password, role, role_id, status, gender, mobileNumber) VALUES (?, ?, ?, ?, 'user', 3, 'active', 'male', '9876543210')",
                [uuidv4(), name, `${name.toLowerCase()}@divine.com`, hashedPassword]
            );
        }

        for (const name of BRIDES) {
            await executeQuery(
                "INSERT INTO users (id, firstName, email, password, role, role_id, status, gender, mobileNumber) VALUES (?, ?, ?, ?, 'user', 3, 'active', 'female', '9876543210')",
                [uuidv4(), name, `${name.toLowerCase()}@divine.com`, hashedPassword]
            );
        }

        res.json({ success: true, message: "Success! 14 users seeded into MySQL." });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


export const updateUniquePhones = async (req, res) => {
    try {
        const users = await executeQuery("SELECT id FROM users WHERE role_id = 3", []);
        for (let i = 0; i < users.length; i++) {
            const uniquePhone = `98765${(10000 + i).toString().substring(1)}`;
            await executeQuery(
                "UPDATE users SET mobileNumber = ? WHERE id = ?",
                [uniquePhone, users[i].id]
            );
        }

        res.json({ success: true, message: `Updated ${users.length} users with unique phone numbers.` });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};