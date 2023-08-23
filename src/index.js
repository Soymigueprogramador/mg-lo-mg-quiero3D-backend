const nombreDelProyecto = 'MG lo quiero 3D';
//Configurando el puerto y las dependencias. 
const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 8080;
//Creando las rutas.
app.use(express.json());
//Abriendo el servidor.
app.get('/', ({req, res}) => {
    res.send('Bienvenidos al backend de ${nombreDelProyecto}'); 
})

//Haciendo que el puerto escuche lo que hacemos.
app.listen(PORT, () => {
    console.log(`servidor escuchando en el puerto${PORT}`);
})