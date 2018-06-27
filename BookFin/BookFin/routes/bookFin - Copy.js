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

/* GET home page. */
router.get('/:string', function(req, res, next) {
    books.updateMany({}, {counter: 0}, function(err, book) {
        if (err) {
            console.log("Error resetting counter");
        }
        else {
            console.log("Nice")
        }
    })
    const request = require("request");

    const options = {
        method: 'GET',
        url: `https://openlibrary.org/search.json?q=${req.params.string}`
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        const subjects = JSON.parse(body).docs[0].subject;
        for (n = 0; n < subjects.length; n++) {
            const accuracy = 1
            const subjectsURL = {
                method: 'GET',
                url: `https://openlibrary.org/subjects/${subjects[n].toLowerCase()}.json?limit=${accuracy}`
            }
            request(subjectsURL, function(error, response, body) {
                books.findOne({key: JSON.parse(body).works[0].key}, function (err, book) {
                    //if it's not in database
                    // console.log(JSON.parse(body).works[i].key)
                    if (book == null) {
                        books.create(
                            {
                                key: JSON.parse(body).works[0].key,
                                title: JSON.parse(body).works[0].title,
                                edition_count: JSON.parse(body).works[0].edition_count,
                                authors: JSON.parse(body).works[0].authors,
                                subject: JSON.parse(body).works[0].subject,
                                counter: 0
                            })
                        // console.log(book)
                    }
                    //it's already in the database
                    else {
                        const newCounter = book.counter + 1
                        books.findOneAndUpdate({key: JSON.parse(body).works[0].key}, {$set: {counter: newCounter}}, {new: true}, function (err, doc) {
                            if (err) {
                                console.log("Something wrong when updating data!");
                            }
                            console.log(doc.counter);
                        })
                        console.log(JSON.parse(body).works[0].key)
                    }
                })

        })}
        res.send('hello world')
    })
});

// router.post('/', function(req, res, next) {
// })

module.exports = router;
