import mongoose from 'mongoose';

const username = 'soymigueprogramador';
const password = 'loquiero3d';
const dbName = 'MG-lo-quiero-3d-database';

/*const url = `mongodb+srv://${username}:${password}@mg-lo-quiero-3d-databas.ph2h9f6.mongodb.net/${dbName}?retryWrites=true&w=majority`;

const client = new MongoClient(url, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }*/



mongoose.connect('mongodb+srv://soymigueprogramador:<password>@mg-lo-quiero-3d-databas.ph2h9f6.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conexión exitosa a la base de datos');
    // Resto de tu código aquí
  })
  .catch((error) => {
    console.error('No me pude conectar a la base de datos', error);
    process.exit(1);
  });

async function run() {
  try {
    await client.connect();
    await client.db(dbName).command({ ping: 1 });
    console.log("Conectado a MongoDB!");
  } finally {
    await client.close();
  }
}
run().catch(console.dir);

async function findChats() {
  let retries = 1; 
  while (retries > 0) {
    try {
      const result = await ChatModel.findChats();
      return result;
    } catch (error) {
      console.error('Error al leer los mensajes guardados', error);
      retries--;
    }
  }
  console.error('Operación de búsqueda fallida después de varios intentos');
  return null;
}
findChats();



export default config; 