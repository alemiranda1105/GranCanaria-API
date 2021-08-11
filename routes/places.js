const express = require('express');
const admin = require('firebase-admin');

const router = express.Router();
const Places = require('../model/places');

//Initialize DB
const db = admin.firestore();
const ref = db.collection('sitios');

// Get all places in the DB
router.get('/', (req, res) => {
    let query = req.query.tag;
    if(typeof query !== 'undefined') {
        let tags = query.split(',');
        readByTag(tags, res);
        //res.status(201).send( { messsage: `tags => ${tags}` });
    } else {
        readAll(res);
        //res.status(201).send( { messsage: `todos leidos` });
    }
});

async function readAll(res) {
    try {
        const query = await ref.get();
        sendResult(query, res);
    } catch (error) {
        res.status(418).send( { message: `${error}` } );
    }
}

async function readByTag(tags, res) {
    try {
        const query = await ref.where('tags', 'array-contains-any', tags).get();
        if(query.empty) {
            throw "Nada encontrado";
        } else {
            sendResult(query, res);
        }
    } catch (error) {
        res.status(418).send( { message: `${error}` } );
    }
}

function searchResult(query, res) {
    var rawRes = [];
    query.forEach((doc) => {
        let data = doc.data();
        rawRes = [...rawRes, data];
    });
    res.json(rawRes);
    res.status(200).send();
}

module.exports = router;