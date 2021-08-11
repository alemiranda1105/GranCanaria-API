
const express = require('express');
// Firebase
const admin = require('firebase-admin');
const serviceAccount = ('./grancanariaapi-firebase-adminsdk-69781-8be6996b2b.json');

const app = express();
const PORT = 8080;
app.use(express.json());

// Initialize firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const placesRoute = require('./routes/places');
app.use('/places', placesRoute);

app.listen(
    PORT,
    () =>  console.log(`it's alive on localhost:${PORT}`)
);
