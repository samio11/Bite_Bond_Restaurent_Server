const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const corsConfig = {
    origin: ['http://localhost:5173','http://localhost:5174'],
    credentials: true,
    optionsSuccessStatus: 200,
}
app.use(cors(corsConfig));
app.use(express.json())

app.get('/',async(req,res)=>{
    res.send('Hello Server is Running')
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})