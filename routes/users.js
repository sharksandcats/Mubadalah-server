import express, { Router } from 'express';
import pgClient from '../db.js';

const userRoutes = express.Router();

//link/api/users
//GET all posts when users enter the homepage
userRoutes.get("/", async (req, res) =>{
    try{
        const result = await pgClient.query("SELECT p.post_id, p.phone_number, p.location, p.image_url, p.caption, u.username, u.profile_url FROM posts p JOIN users u ON p.user_id = u.user_id");
        res.json(result.rows);
    }catch(err){
        res.status(500).json({ error: "Internal server error"});
    }
})

//link/api/users/create
//POST (create a post)
//body >> {user_id, phone_number, location, image_url, caption}
userRoutes.post("/create", async(req,res)=>{
    const {user_id, phone_number, location, image_url, caption} = req.body;
    try{
        const result = await pgClient.query(
            "INSERT INTO posts (user_id, phone_number, location, image_url, caption) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [user_id, phone_number, location, image_url, caption]
        );
        res.json({post: result.rows[0]});
    }catch(err){
        res.status(500).json({error: err});
    }
})

//link/api/users/maya00
//GET (users view their profile)
userRoutes.get("/:username", async(req, res) => {
    try{
        const result = await pgClient.query("SELECT username, profile_url FROM users WHERE username = $1", [req.params.username]);
        if(result.rows.length === 0){
            res.status(404).json({message: "User not found"});
        }
        res.json(result.rows[0]);
    }catch(err){
        res.status(500).json({error: err})
    }
})

//link/api/users/maya00/posts
//GET (users view their posts)
userRoutes.get("/:username/posts", async(req,res)=>{
    try{
        const {username} = req.params;
        const result = await pgClient.query("SELECT p.post_id, p.phone_number, p.location, p.image_url, p.caption, u.username, u.profile_url FROM posts p JOIN users u ON p.user_id = u.user_id WHERE u.username = $1 ORDER BY p.post_id DESC", [username]);
        if(result.rows.length === 0){
            res.status(400).json({message: "You haven't posted yet"});
        }
        res.json(result.rows);
    }catch(err){
        res.status(500).json({error: err})
    }
})

//link/api/users/maya00/saves
//GET (users view their saved posts)
userRoutes.get("/:username/saves", async(req,res)=>{
    try{
        const {username} = req.params;
        const result = await pgClient.query("SELECT u.username, u.profile_url, p.phone_number, p.location, p.image_url, p.caption FROM saves s JOIN posts p ON s.post_id = p.post_id JOIN users u ON p.user_id = u.user_id WHERE s.user_id = (SELECT user_id FROM users WHERE username = $1) ORDER BY s.save_id DESC;", [username]);
        if(result.rows.length === 0){
            res.status(400).json({message: "You haven't saved any posts yet"});
        }
        res.json(result.rows);
    }catch(err){
        res.status(500).json({error: err});
    }
})

//localhost:PORT/api/users/1
//PUT (users edit their profile)
//body >> {name, username, email, password}
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

//localhost:PORT/api/users/maya00/posts/1
//DELETE (users delete their posts)
userRoutes.delete("/:username/posts/:id", async (req, res)=>{
    try{
        const {username, id} = req.params;
        const result = await pgClient.query("DELETE FROM posts WHERE post_id = $1 AND user_id = (SELECT user_id FROM users WHERE username = $2) RETURNING *", [id, username]);
        if(result.rows.length === 0){
            return res.status(404).json({message: "Post not found"});
        }
        res.json({message: "Post deleted", user:result.rows[0]});
    }catch(err){
        res.status(500).json({error: "Internal server error"})
    }
});

export default userRoutes;