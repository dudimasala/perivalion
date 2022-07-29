//w2v REST API



var express = require('express');
var cors = require('cors');
require('@tensorflow/tfjs');
const use = require('@tensorflow-models/universal-sentence-encoder');
var word2Vec_wordList = require('word2vec-wordlist');
var checkWord = require('check-if-word');
var distance = require( 'compute-cosine-distance' );
let words = checkWord('en')

const app = express();


app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
    if(!req.headers.input) {
      res.send("invalid input");
      return;
    }
    
    let userInput = req.headers.input.toLowerCase().split(" ");

    //using dictionary to check if the input is valid.
    for(let i = 0; i<userInput.length; i++) {
      if(!words.check(userInput[i])) {
        res.send("invalid input");
        return
      }
    }

    let dbItems = req.headers.databaseitems.split(",");
    // Load the model.
    if(dbItems.includes(userInput[userInput.length-1])) {
      res.send([userInput[userInput.length-1]]);
      return
    }

    word2Vec_wordList.decompress(() => {
      let scores = [];
      let inputVector = word2Vec_wordList.getWord(userInput[userInput.length-1]);

      if(!inputVector) {
        res.send("invalid input");
        return
      }
      
      inputVector = Array.from(inputVector);

      for(let i = 0; i<dbItems.length; i++) {
        let curItem = dbItems[i].split(" ")
        if(curItem.length > 1) {
          scores.push(2);
          continue;
        }
        let curVec = word2Vec_wordList.getWord(curItem[0]);
        if(!curVec) {
          scores.push(2);
        } else {
          curVec = Array.from(curVec)
          let score = distance(inputVector, curVec);
          scores.push(score);
        }
      }
      let closestItems = [];
      //getting the top 5 scores (top 5 closest words)
      for(let i=0; i<10; i++) {
        let index = scores.indexOf(Math.min(...scores));
        closestItems.push(dbItems[index]);
        scores.splice(index, 1);
        dbItems.splice(index, 1);
      }
      res.send(closestItems);
      return
    });
    /*
    res.send(closestItems);
    */
})

app.listen(5000);