const express = require("express");
const app = express();
const shopKeeper = require('./shopKeeper');

const ip = process.env.IP || '0.0.0.0';
const port = process.env.PORT || 8085;


app.get("/", (req, res) => res.send("boardy scraper"));

app.get("/shopkeeper", (request, response) => {
  const email = request.query.email;
  const password = request.query.password;

  if (email != null && password != null) {
    shopKeeper(email, password).then(results => {
      response.status(200);
      response.json({
        data: results,
        code: 200
      });
    });
  } else {
    response.end();
  }
});

app.listen(port, ip);