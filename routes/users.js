import express, { Router } from 'express';
import pgClient from '../db.js';

const userRoutes = express.Router();

//localhost:PORT/api/users
//GET
userRoutes.get("/", async (req, res) =>{
    try{
        const result = await pgClient.query("SELECT * FROM users");
        res.json(result.rows);
    }catch(err){
        res.status(500).json({ error: "Internal server error"});
    }
})

//localhost:PORT/api/users/maya00
//GET
userRoutes.get("/:username", async(req, res) => {
    try{
        const result = await pgClient.query("SELECT * FROM users WHERE username = $1", [req.params.username]);
        if(result.rows.length === 0){
            res.status(404).json({message: "User not found"});
        }
        res.json(result.rows[0]);
    }catch(err){
        res.status(500).json({error: err})
    }
})

//localhost:PORT/api/users
//POST
userRoutes.post("/", async (req, res)=>{
    console.log("Request body:", req.body);
    const { name, username, email, password } = req.body;
    try{
        const result = await pgClient.query(
            "INSERT INTO users(name, username, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, username, email, password]
        );
        res.status(200).json(result.rows[0]);
    }catch(err){
        res.status(500).json({error: err});
    }
});

//localhost:PORT/api/users/1
//PUT
userRoutes.put("/:id", async(req, res)=>{
    const {name, username, email, password} = req.body;
    try{
        const result = await pgClient.query(
            "UPDATE users SET name = $1, username = $2, email = $3, password = $4 WHERE user_id = $5 RETURNING *",
            [name, username, email, password, req.params.id]
        );
        if(result.rows.length === 0){
            return res.status(404).json({message : "User not found"});
        }
        res.json(result.rows[0]);
    }catch(err){
        res.status(500).json({error: "Internal server error"});
    }
});

//localhost:PORT/api/users/6
//DELETE
userRoutes.delete("/:id", async (req, res)=>{
    try{
        const result = await pgClient.query("DELETE FROM users WHERE user_id = $1 RETURNING *", [req.params.id]);
        if(result.rows.length === 0){
            return res.status(404).json({message: "User not found"});
        }
        res.json({message: "User deleted", user:result.rows[0]});
    }catch(err){
        res.status(500).json({error: "Internal server error"})
    }
});

export default userRoutes;