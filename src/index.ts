import express from "express";

import path from 'path';
const app = express();

import rutas from './rutas';

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(express.static(path.join(__dirname, '../public')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use(rutas);

app.listen(3000, () => {
    console.log("Servidor en puerto 3000", 3000);
});
