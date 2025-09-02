import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import pgClient from './db.js';
import userRoutes from './routes/users.js';

dotenv.config();


const app = express();
const PORT =  process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/users", userRoutes);

app.get("/", (req, res)=>{
    res.json({route: "Home"});
})

pgClient.connect()
.then(()=>{
    app.listen(PORT, ()=>{
    console.log(`Server is listening on PORT: ${PORT}`);
    
    })
})