const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

app.use(cors());
app.use(express.json());

/*
something is changing
*/

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.haic3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const collection = client.db("saronscar").collection("carsinfo");
    const user = { name: "Sakib Saron", email: "sakibsaron1@gmail.com" };
    // const result = await collection.insertOne(user);
    // console.log(`User inserted with id ${result.insertedId}`);
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

async function gettingData() {
  try {
    const db = client.db("saronscar");
    const carCollection = db.collection("carsinfo");
    app.get("/carcollection", async (req, res) => {
      const cursor = carCollection.find({});
      const allcars = await cursor.toArray();
      res.json(allcars);
    });

    app.get("/myitems/:email", async (req, res) => {
      const query = { email: req.params.email };
      const cursor = carCollection.find(query);
      const allitems = await cursor.toArray();
      res.json(allitems);
    });

    app.put("/quantity/:id", async (req, res) => {
      const id = req.params.id;
      const cars = req.body;
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          qty: cars.totalqty,
        },
      };
      console.log(cars.qty);
      const update = await carCollection.updateOne(filter, updateDoc);
      res.json(update);
    });

    app.get("/thecar/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const theCar = await carCollection.findOne(query);
      res.json(theCar);
    });
  } finally {
  }
}
gettingData().catch(console.dir);

async function postData() {
  try {
    const db = client.db("saronscar");
    const carCollection = db.collection("carsinfo");

    app.post("/additems", async (req, res) => {
      const newpost = req.body;
      const addpost = await carCollection.insertOne(newpost);
      res.json(addpost);
      console.log(newpost);
    });
  } finally {
  }
}

postData().catch(console.dir);

async function deleteData() {
  try {
    const db = client.db("saronscar");
    const carCollection = db.collection("carsinfo");

    app.delete("/deleteItem/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const deleteitem = await carCollection.deleteOne(query);
      res.json(deleteitem);
    });
  } finally {
  }
}

deleteData().catch(console.dir);

client.connect((err) => {
  console.log("db connected");
  // perform actions on the collection object
  client.close();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
