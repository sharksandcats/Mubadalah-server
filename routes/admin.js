import express from 'express'
import pgClient from '../db.js'

import adminAuth from '../middleware/adminAuth.js';

const adminRoutes = express.Router();

//link/api/admin
//GET (admin views all posts when entering the homepage)
adminRoutes.get("/", adminAuth, async (req, res) =>{
    try{
        const result = await pgClient.query("SELECT p.post_id, p.phone_number, p.location, p.image_url, p.caption, u.username, u.profile_url FROM posts p JOIN users u ON p.user_id = u.user_id");
        res.json(result.rows);
    }catch(err){
        res.status(500).json({ error: "Internal server error"});
    }
});

//link/api/admin/posts/1
//DELETE (admin deletes a post)
adminRoutes.delete("/posts/:id", async (req, res)=>{
    try{
        await pgClient.query("DELETE FROM saves WHERE post_id = $1", [req.params.id]);
        const result = await pgClient.query(
         "DELETE FROM posts WHERE post_id = $1 RETURNING *",
             [req.params.id]
        );

        if(result.rows.length === 0){
            return res.status(404).json({message: "Post not found"});
        }
        res.json({message: "Post deleted", deleted:result.rows[0]});
    }catch(err){
        console.error(err);
        res.status(500).json({error: err.message, stack: err.stack})
    }
});

//link/api/admin/admin
//GET (admin views their profile)
adminRoutes.get("/:username", async(req, res) => {
    try{
        const result = await pgClient.query("SELECT name, email, password FROM users WHERE username = $1", [req.params.username]);
        if(result.rows.length === 0){
            res.status(404).json({message: "User not found"});
        }
        res.json(result.rows[0]);
    }catch(err){
        res.status(500).json({error: err})
    }
});

export default adminRoutes;


