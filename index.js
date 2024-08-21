const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
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
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mmutbdd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
const food_Collection  = client.db("Bite_Bond").collection("Foods_Collection")
async function run() {
  try {
    // Home page Our Menu Section
    app.get('/home-menu',async(req,res)=>{
        const  query = {
            food_price: {$gt:5.00,$lt:10.00}
        }
        const result = await food_Collection.find(query).limit(6).toArray()
        res.send(result)

    })
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})