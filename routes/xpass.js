let express = require('express');
let router = express.Router();


router.get("/metadata/:token_id", (req, res) => {
    //console.log(res)
    let token_id = req.params.token_id;
    
    if(token_id < 1 || token_id > 30000){
        res.status(418).json({ message : "I'm a teapot"});
        return;
    }

    //let metadata = new Metadata(token_id).toJSON();
    //res.json(metadata);
    res.json({"test":"test"});
});

router.get("/image", (req, res) => {
    res.sendFile('../image/xpass.png')
});

module.exports = router;