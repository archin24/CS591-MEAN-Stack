const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/:string', function(req, res, next) {
    res.json({"string" : req.params.string,  "length" : req.params.string.length });
});

router.post('/', function(req, res, next) {
    console.log(Object.keys(req.body))
    res.json({"string" : Object.keys(req.body)[0], "length" : Object.keys(req.body)[0].length});
})

module.exports = router;
