import pgClient from "../db.js";

const adminAuth = async (req, res, next) => {
  try {
    const adminId = req.headers["user_id"]; // admin must send their ID

    if (!adminId) {
      return res.status(401).json({ message: "Missing admin user_id in headers" });
    }

    const result = await pgClient.query(
      "SELECT isAdmin FROM users WHERE user_id = $1",
      [adminId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Admin user not found" });
    }

    if (!result.rows[0].isadmin) {
      return res.status(403).json({ message: "Access denied: Admin required" });
    }

    next();
  } catch (err) {
    console.error("Admin auth error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default adminAuth;
 