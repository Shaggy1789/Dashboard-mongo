const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
app.use(cors());

// URL de conexión que me mandaste (con tu usuario y contraseña)
const uri = "mongodb+srv://admin:password123%40%40@cluster0.9hmlhql.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri);

app.get("/api/dashboard", async (req, res) => {
  try {
    await client.connect();
    
    // Nombres exactos de tu Mongo Atlas
    const database = client.db("SensoresDb"); 
    const collection = database.collection("SensorData"); 

    const datos = await collection
      .find({})
      .sort({ Fecha: -1 }) // Corregido para que ordene por "Fecha"
      .limit(100)
      .toArray();

    res.json(datos);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

app.listen(3001, () => {
  console.log("Servidor Mongo iniciado en el puerto 3001 🚀");
});