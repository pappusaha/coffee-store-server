const express=require('express')
const app=express()
const cors=require('cors')
const port=process.env.PORT || 5000
require('dotenv').config()

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// middleWare
app.use(cors())
app.use(express.json())

// this is mongoDB section 


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8bwej.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)
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
    await client.connect();
    // Send a ping to confirm a successful connection

//  here is mongoDB section 

const coffeeCollection = client.db("coffeeDB").collection("coffee"); 
  const userCollection=client.db('coffeeDB').collection('user')
//  this is get section 
app.get('/coffee', async (req, res) => {
    const cursor = coffeeCollection.find();
    const result = await cursor.toArray()
    res.send(result)

})
// this is find section 
app.get('/coffee/:id', async( req, res) => {

const id=req.params.id
const query={_id : new ObjectId(id)
}
const result = await coffeeCollection.findOne(query);
res.send(result)

})

    //  here post section 

app.post('/coffee', async (req, res) =>  {
    const newCoffee=req.body
    console.log(newCoffee)
    const result=await  coffeeCollection.insertOne(newCoffee)
    res.send(result)

})
// need to update someting 

app.put(`/coffee/:id`, async (req,res) => {
    const id =req.params.id
    const filter={_id : new ObjectId(id)}
    const options = { upsert: true };
    const updatedCoffee=req.body
    const updateDoc = {
        $set: {
            coffeeName :updatedCoffee.coffeeName ,
            chef:updatedCoffee.chef,
            details:updatedCoffee.details,
            taste:updatedCoffee.taste,
            category:updatedCoffee.category,
            photo:updatedCoffee.photo,
            company:updatedCoffee.company,
            supplier:updatedCoffee.supplier,
            quantity:updatedCoffee.quantity,
            
        },

      };

      const result = await coffeeCollection.updateOne(filter, updateDoc, options);
      res.send(result)
    })
app.delete('/coffee/:id', async (req, res) => {
    const id=req.params.id
    const query= {_id : new ObjectId(id)}
    const result = await coffeeCollection.deleteOne(query);
    res.send(result)

})


//  this is user Registration
app.get('/user', async (req, res) => {
  const cursor= userCollection.find()
  const result= await cursor.toArray()
  res.send(result)
})
// this is post section 
app.post('/user', async (req, res) => {
const newUser=req.body
const result= await userCollection.insertOne(newUser)
res.send(result)
})

app.patch('/user', async (req,res)=> {
  const user=req.body
  const filter={email : user.email }
  const updateDoc = {
    $set: {
      lastLogin:user.lastLogin
    },
  }; 
  const result=await userCollection.updateOne(filter,updateDoc)
  res.send(result)
})

// this is delete section 

app.delete('/user/:id',async (req, res) => {
  const id=req.params.id
  const query={_id : new ObjectId(id)}
  const result= await userCollection.deleteOne(query)
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




//  for the root section 

app.get('/', (req, res) =>  {
    res.send('coffee making server is running ')
})

// in which port i am logging in 
app.listen(port,() => {
console.log(`coffee server is running port on ${port}`)
})


