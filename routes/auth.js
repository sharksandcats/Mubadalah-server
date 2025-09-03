import express from 'express';
import pgClient from '../db.js';

const router = express.Router();

//url/api/auth/signup
//POST
//body >> {name, username, email, password}
router.post("/signup", async (req, res)=>{
    const { name, username, email, password } = req.body;
    try{
        const exists = await pgClient.query("SELECT * FROM users WHERE username = $1", [username]);
        if(exists.rows.length > 0) return res.status(400).json({message: "A user with this email already exists"});

        const result = await pgClient.query(
            "INSERT INTO users(name, username, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, username, email, password]
        );
        res.status(200).json(result.rows[0]);
    }catch(err){
        res.status(500).json({error: err});
    }
});

//url/api/auth/login
//POST
//body >> {username, password}
router.post("/login", async(req, res)=>{
    const {username, password} = req.body;
    try{
        const result = await pgClient.query(
            "SELECT * FROM users WHERE username = $1 AND password = $2", 
            [username, password]
        );
        if(result.rows.length === 0) return res.status(401).json({message: "Invalid credintials"});
        res.json({user: result.rows[0]});
    }catch(err){
        res.status(500).json({error: err});
    }
});

export default router;