const { raw } = require('express');
const express = require('express');
const admin = require('firebase-admin');

const router = express.Router();
const cors = require('cors');


//Initialize DB
const db = admin.firestore();
const ref = db.collection('sitios');

// Get places in the DB
router.get('/', cors(),(req, res) => {
    let query = req.query;
    let tagQuery = query.tag;
    let nameQuery = query.name;

    if(typeof tagQuery !== 'undefined') {
        let tags = tagQuery.split(',');
        readByTag(tags, res);
    } else if(typeof nameQuery !== 'undefined') {
        readByName(nameQuery, res);
        // res.status(201).send( { messsage: `name => ${nameQuery}` });
    } else {
        readAll(res);
    }
});

router.post('/add', async function(req, res) {
    const { name, url, tags } = req.body;
    if(!name, !url, !tags) {
        sendError("Error al añadir elementos", res);
        return;
    }
    // Add code to upload new places to the firebase DB
    await ref.add({
        name: name,
        url: url,
        tags: tags
    });

    res.status(200).send({
        message: "POST request recibida",
        uploaded: true
    });
});

async function readAll(res) {
    try {
        const query = await ref.get();
        sendResult(query, res);
    } catch (error) {
        sendError(error, res);
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
        sendError(error, res);
    }
}

async function readByName(name, res) {
    try {
        const query = await ref.where('name', "==", name).get();
        if(query.empty) {
            throw "Nada encontrando";
        } else {
            sendResult(query, res);
        }
    } catch (error) {
        sendError(error, res);        
    }
}

function sendResult(query, res) {
    var rawRes = [];
    query.forEach((doc) => {
        let data = new Object();
        data.name = doc.data().name;
        data.data = doc.data();
        rawRes.push(data);
    });
    res.json(rawRes);
    res.status(200).send();
}

function sendError(error, res) {
    res.status(418).send( { message: `${error}` } );
}

module.exports = router;