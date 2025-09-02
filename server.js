import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import pgClient from './db.js';
import router from './routes/auth.js';
import userRoutes from './routes/users.js';
import adminRoutes from './routes/admin.js';


dotenv.config();


const app = express();
const PORT =  process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


app.use("/api/auth", router);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

//app.get("/", (req, res)=>{
//    res.json({route: "Home"});
//})

pgClient.connect()
.then(()=>{
    app.listen(PORT, ()=>{
    console.log(`Server is listening on PORT: ${PORT}`);
    })
})