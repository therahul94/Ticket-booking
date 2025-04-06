import express from "express";
import cors from 'cors';
import router from "./src/route.js";
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/v1', router);
app.use('/', (req, res)=>{
    return res.json({message: "Backend is running like a butter"});
})


app.listen(process.env.PORT || 3000, ()=> {
    console.log(`Server is running on port: ${process.env.PORT || 3000}`);
})