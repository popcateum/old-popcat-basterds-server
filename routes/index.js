let express = require('express');
let router = express.Router();

router.get("/", (req, res) => {
    console.log("Ping " + req.get('host') + " from " + req.get('origin'));
    console.log(req);
    res.status(200).send("Hello Old PopCat Bastards!");
});

module.exports = router;