//w2v REST API

var express = require('express');
var cors = require('cors');
require('@tensorflow/tfjs');
const use = require('@tensorflow-models/universal-sentence-encoder');
var checkWord = require('check-if-word');
let words = checkWord('en')

const app = express();

app.use(express.json());
app.use(cors());


const dotProduct = (xs, ys) => {
  const sum = xs => xs ? xs.reduce((a, b) => a + b, 0) : undefined;

  return xs.length === ys.length ?
    sum(zipWith((a, b) => a * b, xs, ys))
    : undefined;
}

// zipWith :: (a -> b -> c) -> [a] -> [b] -> [c]
const zipWith =
    (f, xs, ys) => {
      const ny = ys.length;
      return (xs.length <= ny ? xs : xs.slice(0, ny))
          .map((x, i) => f(x, ys[i]));
    }


app.get('/', (req, res) => {
    let userInput = req.headers.input.split(" ");

    //using dictionary to check if the input is valid.
    for(let i = 0; i<userInput.length; i++) {
      if(!words.check(userInput[i])) {
        res.send("invalid input");
        return
      }
    }

    let dbItems = req.headers.databaseitems.split(",");
    // Load the model.
    use.loadQnA().then(model => {
    const input = {
      queries: [req.headers.input],
      responses: dbItems
    };
    var scores = [];
    const embeddings = model.embed(input);
    const embed_query = embeddings['queryEmbedding'].arraySync();
    const embed_responses = embeddings['responseEmbedding'].arraySync();
    // compute the dotProduct of each query and response pair. The higher the dot, the closer context the items
    for (let i = 0; i < input['queries'].length; i++) {
      for (let j = 0; j < input['responses'].length; j++) {
        scores.push(dotProduct(embed_query[i], embed_responses[j]));
      }
    }

    let closestItems = [];
    //getting the top 5 scores (top 5 closest words)
    for(let i=0; i<5; i++) {
      let index = scores.indexOf(Math.max(...scores));
      closestItems.push(dbItems[index])
      scores.splice(index, 1);
      dbItems.splice(index, 1);
    }
    res.send(closestItems);
    });
})

app.listen(5000);

