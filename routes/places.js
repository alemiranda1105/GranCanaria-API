const express = require('express');
const admin = require('firebase-admin');

const router = express.Router();
const Places = require('../model/places');

//Initialize DB
const db = admin.firestore();
const ref = db.collection('sitios');

// Get all places in the DB
router.get('/', async(req, res) => {
    try {
        const query = await ref.get();
        var rawRes = [];
        query.forEach((doc) => {
            let data = doc.data();
            rawRes = [ ...rawRes, data];
        });
        res.json(rawRes);
        res.status(200).send();

    } catch (error) {
        res.status(418).send( { message: `${error}` } );
    }
});

/*async function read() {
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
}*/

module.exports = router;