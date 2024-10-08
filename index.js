const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, Timestamp } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
const corsConfig = {
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  optionsSuccessStatus: 200,
}
app.use(cors(corsConfig));
app.use(express.json())

app.get('/', async (req, res) => {
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
const food_Collection = client.db("Bite_Bond").collection("Foods_Collection")
const food_Rating_Collection = client.db("Bite_Bond").collection("Food_Rating")
const food_Ordering_Collection = client.db("Bite_Bond").collection("Food_Ordered")
const usersCollection = client.db("Bite_Bond").collection("Users");
async function run() {
  try {
    // Home page Our Menu Section
    app.get('/home-menu', async (req, res) => {
      const query = {
        food_price: { $gt: 5.00, $lt: 10.00 }
      }
      const result = await food_Collection.find(query).limit(6).toArray()
      res.send(result)
    })
    // Home Page Chef Recommend
    app.get('/home-chef-recommend', async (req, res) => {
      const query = {
        food_rating: { $gt: 4.6 }
      }
      const result = await food_Collection.find(query).limit(3).toArray()
      res.send(result)
    })

    // For Home Page
    app.get('/food-rating', async (req, res) => {
      const result = await food_Rating_Collection.find().limit(3).toArray()
      res.send(result)
    })

    // For Menu Page
    app.get('/menu-top-foods', async (req, res) => {
      const query = {
        food_rating: { $gt: 4.7 }
      }
      const result = await food_Collection.find(query).limit(4).toArray()
      res.send(result)
    })

    // Review to save database
    app.post('/rating', async (req, res) => {
      const data = req.body;
      const result = await food_Rating_Collection.insertOne(data);
      res.send(result);
    })

    // Store All food a user is Ordered
    app.post('/ordering-food', async (req, res) => {
      const data = req.body;
      const result = await food_Ordering_Collection.insertOne(data);
      res.send(result);
    })

    // login->> userCollection store user Data and also role
    app.put('/user', async (req, res) => {
      const user = req.body;
      const isExist = await usersCollection.findOne({ email: user?.email })
      if (isExist) return res.send(isExist)
      const options = { upsert: true }
      const query = { email: user.email }
      const updateUser = {
        $set: {
          ...user, Timestamp: Date.now()
        },
      }
      const result = await usersCollection.updateOne(query, updateUser, options)
      res.send(result);
    })

    // Get all review data to disable button
    app.get('/ratingData', async (req, res) => {
      const result = await food_Rating_Collection.find().toArray()
      res.send(result)
    })

    // For Menu category wise data Load by query
    app.get('/selected-category-food', async (req, res) => {
      const { category } = req.query
      const query = {
        food_category: category
      }
      const result = await food_Collection.find(query).toArray()
      res.send(result)
    })

    // Load Role
    app.get('/user/:email', async (req, res) => {
      const email = req.params.email;
      const user = await usersCollection.findOne({ email });
      res.send(user)
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