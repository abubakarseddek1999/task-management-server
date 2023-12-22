const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { default: Stripe } = require('stripe');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bidtnbd.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const taskCollection = client.db("taskManagement").collection("task");

    // task related apis

    app.get('/task', async (req, res) => {
      const result = await taskCollection.find().toArray();
      res.send(result);
    })

    app.post('/task', async (req, res) => {
      const taskData = req.body;
      console.log(taskData);
      const result = await taskCollection.insertOne(taskData);
      res.send(result)
    })

    app.get('/task/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: (id) }
      const result = await taskCollection.findOne(query);
      res.send(result);
    })

   
    // update menu
    app.patch('/task/:id', async (req, res) => {
      const item = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      console.log(filter);
      const updatedDoc = {
        $set: {
          title: item.title,
          description: item.description,
          deadline: item.deadline,
          priority: item.priority,
          users: item.users,
          status:item.status

        }
      }
      // console.log(updatedDoc);
      const result = await taskCollection.updateOne(filter, updatedDoc)
      res.send(result)
    })


    // task delete
    app.delete('/task/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await taskCollection.deleteOne(query)
      res.send(result);
    })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }
  finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Task is running')
})

app.listen(port, () => {
  console.log(`TaskManagement is sitting on port ${port}`);
})