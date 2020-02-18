const express = require('express');
const cors = require('cors');
const volleyball = require("volleyball");
const messages = require('./db/messages')

const app = express()

app.use(cors());
app.use(volleyball);

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'CVE API ✔'
  });
});

app.get('/messages', (req, res, next) => {
  Promise.all([
      messages
      .getAll(),
      messages
      .count()
    ])
    .then(([allResults, total]) => {
      res.json({
        allResults,
        total
      });
    }).catch(next);
});

app.post('/search', (req, res, next) => {
  const rawResponse = req.body.input.toString().trim();
  const response = `"${rawResponse}"`;

  console.log(response);

  messages.findCVE(response)
    .then(result => {
      res.json(result)
    }).catch(next);
});

app.get('/byId', (req, res, next) => {
  const id = req.query.id
  console.log(id);
  messages.findId(id)
    .then(result => {
      res.json(result)
    }).catch(next)
});


app.use((error, req, res, next) => {
  res.status(500);
  res.json({
    message: error.message
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on ${port}`)
})