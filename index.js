
const express = require('express');
// Firebase
const admin = require('firebase-admin');
const serviceAccount = ('./grancanariaapi-firebase-adminsdk-69781-8be6996b2b.json');

const app = express();
const PORT = 8080;
app.use(express.json());

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
const ref = db.collection('sitios');

app.listen(
    PORT,
    function() {
        console.log("working");
        read(["city"]);
    }
);


async function read() {
    const res = await ref.get();
    res.forEach((doc) => {
        console.log(doc.id, '=>', doc.data());
    })
}

async function read(tags) {
    const query = await ref.get();
    query.forEach((doc) => {
        console.log(doc.data);
        if(doc.tags.includes(tags)) {
            console.log(doc.name, '=>', doc.url);
        }
    });
}