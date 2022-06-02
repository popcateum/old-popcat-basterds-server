let express = require('express');
let router = express.Router();


class Metadata{
    name = "";
    image = "";
    description = "";
    attributes = [];

    constructor(token_id) {
        if(token_id <= 100){
            let year = "2015";
            let grade = "Legendary";

            this.name = grade + " Popcat #" + token_id;
            this.image = "https://storage.googleapis.com/popcateum-asset/images/opb/grade/"+ year + ".png";
            this.description = "Some people can not believe that you started to use Ethereum blockchain in 2015. You’re one of early adopters in the blockchain. 2015 is too early even though some chart services do not have price data. Well, did you participate in Ethereum ICO? Your blockchain story becomes a hot topic among people.Are you already a whale? People would guess so.";
            this.attributes = [
                { "trait_type": "Year", "value": year },
                { "trait_type": "Grade", "value": grade}
            ]
        }else if(token_id <= 300){
            let year = "2016";
            let grade = "GOAT";

            this.name = grade + " Popcat #" + token_id;
            this.image = "https://storage.googleapis.com/popcateum-asset/images/opb/grade/"+ year + ".png";
            this.description = "If you say you started to use Ethereum blockchain in 2016, people will be amazed and respect you. You are above the top 3% of cryptonians because you entered the blockchain industry so early compared to other people. The price of Ethereum was less than 10 USD.You’re a fossil which is alive.";
            this.attributes = [
                { "trait_type": "Year", "value": year },
                { "trait_type": "Grade", "value": grade}
            ]
        }else if(token_id <= 700){
            let year = "2017";
            let grade = "Grand Master";

            this.name = grade + " Popcat #" + token_id;
            this.image = "https://storage.googleapis.com/popcateum-asset/images/opb/grade/"+ year + ".png";
            this.description = "2017 was an important time when the ecosystem of Ethereum was getting bigger rapidly due to its price increase. The price reached around 400 USD per one Ethereum and people were shocked. Still you’re one of the early adopters.";
            this.attributes = [
                { "trait_type": "Year", "value": year },
                { "trait_type": "Grade", "value": grade}
            ]
        }else if(token_id <= 2000){
            let year = "2018";
            let grade = "Master";

            this.name = grade + " Popcat #" + token_id;
            this.image = "https://storage.googleapis.com/popcateum-asset/images/opb/grade/"+ year + ".png";
            this.description = "2018 was a hard time for cryptonians. If you were born in 2018, you can say that you experienced an enormous bear market and now you survived. You deserve respect as an old bastard.";
            this.attributes = [
                { "trait_type": "Year", "value": year },
                { "trait_type": "Grade", "value": grade}
            ]
        }else if(token_id <= 3500){
            let year = "2019";
            let grade = "Padawan";

            this.name = grade + " Popcat #" + token_id;
            this.image = "https://storage.googleapis.com/popcateum-asset/images/opb/grade/"+ year + ".png";
            this.description = "Theoretically, you are still early adopters. You’re not that old compared to older basterds popcats but now you know much about blockchain and Ethereum. Maybe you are experienced enough to brag to non-cryptonians.";
            this.attributes = [
                { "trait_type": "Year", "value": year },
                { "trait_type": "Grade", "value": grade}
            ]
        }else if(token_id <= 5500){
            let year = "2020";
            let grade = "Youngling";

            this.name = grade + " Popcat #" + token_id;
            this.image = "https://storage.googleapis.com/popcateum-asset/images/opb/grade/"+ year + ".png";
            this.description = "You are not that old actually. Need to respect older popcat basterds.Keep the spirit of HODL.Youngling Popcats start to have subtle lasers on their eyes.";
            this.attributes = [
                { "trait_type": "Year", "value": year },
                { "trait_type": "Grade", "value": grade}
            ]
        }else if(token_id <= 8000){
            let year = "2021";
            let grade = "Kitten";

            this.name = grade + " Popcat #" + token_id;
            this.image = "https://storage.googleapis.com/popcateum-asset/images/opb/grade/"+ year + ".png";
            this.description = "At the last, you start to have a small laser on your eyes. But you are too young.Be a young popcat bastard.";
            this.attributes = [
                { "trait_type": "Year", "value": year },
                { "trait_type": "Grade", "value": grade}
            ]
        }else if(token_id <= 10000){
            let year = "2022";
            let grade = "N00b";

            this.name = grade + " Popcat #" + token_id;
            this.image = "https://storage.googleapis.com/popcateum-asset/images/opb/grade/"+ year + ".png";
            this.description = "You are a N00b popcat.You need to grow and learn more.You need to respect old bastard popcats.You are too young to have a laser on your eyes. Good luck, N00b.";
            this.attributes = [
                { "trait_type": "Year", "value": year },
                { "trait_type": "Grade", "value": grade}
            ]
        }
    }
    toJSON (){
        return{
            name : this.name,
            image : this.image,
            description : this.description,
            attributes : this.attributes
        }
    }

}

router.get("/:token_id", (req, res) => {

    let token_id = req.params.token_id;
    
    if(token_id < 1 || token_id > 10000){
        res.status(418).json({ message : "I'm a teapot"});
        return;
    }

    let metadata = new Metadata(token_id).toJSON();
    console.log(metadata);

    res.json(metadata);
});

module.exports = router;