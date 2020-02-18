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

app.get('/messages', async (req, res) => {
  const count = await messages.count();
  console.log(count);
  const message = await messages.getAll();
   res.json(message);
});

app.post('/search', (req, res, next) => {
  const rawResponse = req.body.input.toString().trim();
  const response = `"${rawResponse}"`;

  console.log(response);

  Promise.all([
    messages
      .findCVE(response),
    messages
      .count()
  ])
  .then(([ search, total ]) => {
    res.json({
      search,
      total
    });
  }).catch(next);
  // messages.findCVE(response).then((search) => {
  //   res.json(search);
  // }).catch((error) => {
  //   res.status(500);
  //   res.json(error);
  // })
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

app.listen(port, () => {console.log(`Listening on ${port}`)})