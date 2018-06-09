const express = require('express');
const router = express.Router();

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/CS591-HW2')
const db = mongoose.connection;
db.once('open', function () {
    console.log('Connection successful.')
});
const Schema = mongoose.Schema
const stringSchema = new Schema({
    string: String,
    length: String
});
const stringss = mongoose.model('stringss', stringSchema);

router.get('/', function(req, res) {
    stringss.find({}, '-_id -__v', function(err, results) {res.json(results)})
})

router.get('/:string', function(req, res) {
    stringss.findOneAndUpdate({string : req.params.string}, {length : req.params.string.length}, {upsert:true, new:true}, function(err,strings){
        res.json("string : " + strings.string + ", length : " + strings.length)
    })
});

router.post('/', function(req, res) {
    stringss.findOneAndUpdate({string : Object.keys(req.body)[0]}, {length : Object.keys(req.body)[0].length}, {upsert:true, new:true}, function(err,strings){
        res.json("string : " + strings.string + ", length : " + strings.length)
    })
})

router.delete('/:string', function(req, res) {
    stringss.find({string : req.params.string, length : req.params.string.length},function (err, strings) {
        console.log(strings)
        console.log(strings == [])
        if (strings == []) {
            res.json("String not found.")
        }
        else {
            stringss.remove({string : req.params.string, length : req.params.string.length}).then(() => res.json("Document has been removed."))
        }
    })
})

module.exports = router;
