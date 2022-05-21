let express = require('express');
let router = express.Router();

router.get("/", (req, res) => {
    res.status(200).send("Hello Old PopCat Bastards!");
});

module.exports = router;