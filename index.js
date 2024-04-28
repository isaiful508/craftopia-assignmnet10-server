const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

//middleware 
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.bhtyeej.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`;


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

    const craftCollection = client.db('craftDB').collection('crafts')

    //view details route
    app.get('/view_details/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const craftDetails = await craftCollection.findOne(query)
      res.send(craftDetails);

    })

    app.get('/craft_items', async (req, res) =>{
      const cursor = craftCollection.find();
      const result = await cursor.toArray();

      res.send(result);
    })




    app.post('/craft_items', async(req, res) =>{
      const newCraftItem = req.body;
      console.log(newCraftItem);

      const result = await craftCollection.insertOne(newCraftItem)
      res.send(result);
    })


    //my arts and crafts list

    app.get('/art_&_craft_lists/:email', async (req, res) =>{
      console.log(req.params.email);
      const result = await craftCollection.find({email:req.params.email}).toArray();
      res.send(result);
    })

    app.delete('/delete/:id', async(req, res) =>{
      const result = await craftCollection.deleteOne({_id : new ObjectId(req.params.id)})
      console.log(result);
      res.send(result);
    })







    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);













app.get('/', (req, res) =>{
    res.send('Craftopis server is running')
})

app.listen(port, () => {
    console.log(`Craftopia server is running on port: ${port}`);
})