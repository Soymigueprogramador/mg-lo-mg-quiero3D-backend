import mongoose from 'mongoose';
//import dotenv from 'dotenv';

const username = 'soymigueprogramador';
const password = 'loquiero3d';
const dbName = 'MG-lo-quiero-3d-database';
//const miUrlMongodb = 'mongodb+srv://${username}:${password}@mg-lo-quiero-3d-databas.ph2h9f6.mongodb.net/${dbName}?retryWrites=true&w=majority'

export async function conectameMongodb() {
    try {
        await mongoose.connect(`mongodb+srv://${username}:${password}@mg-lo-quiero-3d-databas.ph2h9f6.mongodb.net/${dbName}?retryWrites=true&w=majority`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Conectado a MongoDB');
    } catch (error) {
        console.error('UH capo algo salió mal y no te conectaste a la base de datos', error);
    }
};
conectameMongodb();