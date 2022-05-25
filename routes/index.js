let express = require('express');
let router = express.Router();

router.get("/", (req, res) => {
    console.log("hello " + req.get('host') + " from " + req.get('origin'));
    res.status(200).send("Hello Old PopCat Bastards!");
});

module.exports = router;