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

app.get('/v2/messages', (req, res, next) => {
  // let skip = parseInt(req.query.skip) || 0;
  // let limit = parseInt(req.query.limit) || 10;
  let { skip, limit, sort = 'desc'} = req.query;

  // Checking for numbers not strings
  skip = parseInt(skip) || 0;
  limit = parseInt(limit) || 10;

  // limiting the limit
  // limit = limit > 50 ? 50 : limit;

  // Negative numbers
  skip = skip < 0 ? 0 : skip;
  // limit = Math.min(50, Math.max(1, limit));

  Promise.all([
    messages
    .count(),
    messages
    .pagination(
      skip,
      limit,
      {
        "CVE_data_meta.ID": sort === 'desc' ? -1 : 1,
     })
  ])
  .then(([total, cves]) => {
    res.json({
    cves,
    meta: {
      total,
      skip,
      limit,
      has_more: total - (skip + limit) > 0,
    }
    });
  }).catch(next)
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