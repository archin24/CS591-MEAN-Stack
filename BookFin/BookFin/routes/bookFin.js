const express = require('express');
const router = express.Router();

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/bookFin')
const db = mongoose.connection;
db.once('open', function () {
    console.log('Connection successful.')
});
const Schema = mongoose.Schema
const bookSchema = new Schema({
    key: String,
    title: String,
    edition_count: String,
    authors: String,
    subject: String,
    counter: Number
});
const books = mongoose.model('books', bookSchema);

router.get('/search/:string', function(req, res, next) {
    books.remove({},function(err) {}).then()
    {
        const request = require("request");

        const options = {
            method: 'GET',
            url: `https://openlibrary.org/search.json?q=${req.params.string}`
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);

            const subjects = JSON.parse(body).docs[0].subject;
            const accuracy = 10;
            for (n = 0; n < subjects.length; n++) {
                callSubjects(subjects, accuracy, n)
            }
        })
        res.send('hello world')
    }});

function callSubjects(subList, accuracy, subject) {
    const request = require("request");
    const subjectsURL = {
        method: 'GET',
        url: `https://openlibrary.org/subjects/${subList[subject].toLowerCase()}.json?limit=${accuracy}`
    }
    request(subjectsURL, function(error, response, body) {
        for (i = 0; i < accuracy; i++) {
            updateData(i, body)
        }
})}

function updateData(i, body) {
    books.findOne({key: JSON.parse(body).works[i].key}, function (err, book) {
        //if it's not in database
        if (book == null) {
            books.create(
                {
                    key: JSON.parse(body).works[i].key,
                    title: JSON.parse(body).works[i].title,
                    edition_count: JSON.parse(body).works[i].edition_count,
                    authors: JSON.parse(body).works[i].authors,
                    subject: JSON.parse(body).works[i].subject,
                    counter: 0
                })
            console.log(JSON.parse(body).works[i].key)
        }
        //it's already in the database
        else {
            const newCounter = book.counter + 1
            books.findOneAndUpdate({key: JSON.parse(body).works[i].key}, {$set: {counter: newCounter}}, {new: true}, function (err, doc) {
                if (err) {
                    console.log("Something wrong when updating data!");
                }
                console.log(JSON.parse(body).works[i].key)
                console.log(doc.counter);
            })
        }
    })
}

router.get('/review/:string', function(req, res, next) {
    const request = require("request");
    const DOMParser = require('xmldom').DOMParser;

    const options = {
        method: 'GET',
        url: 'https://www.goodreads.com/book/title.xml',
        qs: {
            key: 'nLki4UKN7IxmA4ovtDsrA',
            title: 'Hound of the Baskervilles',
            author: 'Arthur Conan Doyle'
        }
    }

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        const parser = new DOMParser(),
            xmlDoc = parser.parseFromString(body, "text/xml");

        console.log(xmlDoc.getElementsByTagName('topics'))
        // console.log(body);
    });
});


module.exports = router;
