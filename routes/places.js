const express = require('express');
const admin = require('firebase-admin');

const router = express.Router();
const Places = require('../model/places');

//Initialize DB
const db = admin.firestore();
const ref = db.collection('sitios');

// Get places in the DB
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

router.post('/add', (req, res) => {
    const { name, url, tags } = req.body;
    if(!name, !url, !tags) {
        sendError("Error al añadir elementos");
        return;
    }
});

async function readAll(res) {
    try {
        const query = await ref.get();
        searchResult(query, res);
    } catch (error) {
        sendError(error);
    }
}

async function readByTag(tags, res) {
    try {
        const query = await ref.where('tags', 'array-contains-any', tags).get();
        if(query.empty) {
            throw "Nada encontrado";
        } else {
            searchResult(query, res);
        }
    } catch (error) {
        sendError(error);
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

function sendError(error) {
    res.status(418).send( { message: `${error}` } );
}

module.exports = router;