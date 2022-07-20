const PORT = 8000

const axios = require("axios").default
const express = require("express")
const cors = require("cors")
const { request } = require("express")
require('dotenv').config()

const app = express()

app.use(cors())

app.get('/word', (req, res) => {

    const options = {
        method: 'GET',
        url: 'https://random-words5.p.rapidapi.com/getMultipleRandom',
        params: {count: '5', wordLength: '5'},
        headers: {
            'X-RapidAPI-Key': 'f3c8f9a4a5msh38fb60b4fb2c1b3p1aa0bejsn80b957889f33',
            'X-RapidAPI-Host': 'random-words5.p.rapidapi.com'
        }
    }

    axios.request(options).then((response) => {
	    console.log(response.data)
        res.json(response.data[0])
    }).catch((error) => {
	    console.error(error)
    });

})

/*
app.get('/check', (req, res) => {
    
    const word = req.query.word

    const options = {
        method: 'GET',
        url: 'https://twinword-word-graph-dictionary.p.rapidapi.com/association/',
        params: {entry: word},
        headers: {
          'X-RapidAPI-Key': '',
          'X-RapidAPI-Host': 'twinword-word-graph-dictionary.p.rapidapi.com'
        }
    };
      
    axios.request(options).then((response) => {
        console.log(response.data)
        request.json(response.data.result_msg)
    }).catch((error) => {
        console.error(error);
    });
})

*/


app.listen(PORT, () => console.log("listening on port " +PORT))

