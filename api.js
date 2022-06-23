const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const prettier = require('prettier');
require('dotenv').config();
const mongoose = require("mongoose");
const { Schema } = mongoose;
const schema = new Schema({
  id: Number,
  name: String,
  surname: String,
  email: String,
  phone: String,
  deleted: Boolean,
});
const app = express();
const port = 3000;

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Credentials', 'true');
  res.append('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS');
  res.append('Access-Control-Allow-Headers', 'Authorization, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, X-Auth-Token');
  next();
});

app.get('/', (req, res) => {
  res.send('This is express RESTful API - do not use in production ;)');
});
app.get('/clients', (req, res) => {
  res.set('Access-Control-Allow-Origin', 'http://localhost:4200');
  const clients = mongoose.model('clients', schema);
  clients.find({}, 'id name surname email phone deleted').then(function (data) {
    res.send(prettier.format(JSON.stringify(data), { semi: false, parser: "json" }));
  }).catch(function(err) {
    console.log('Error @Post: ', err);
    res.send(prettier.format('{ "status": 3, "errorMessage": "Error @Clients Get!"}', { semi: false, parser: "json" }));
  });
});
app.post('/clients', jsonParser, (req, res) => {
  const clients = mongoose.model('clients', schema);
  var items = req.body;
  clients.count({}, function(err, cnt) {
    if (err) return handleError(err);
    console.log('initial items: ', items, cnt);
    var newItems = [];
    for(var i=0; i<items.length; i++) {
      var item = { id: 0, ...items[i] };
      item.id = (cnt+i+1);
      newItems.push(item);
    }
    console.log('items after id update: ', newItems, cnt);
    clients.insertMany(newItems).then(function(docs) {
      console.log('Post done! Count: ', docs.length);
      res.send(prettier.format('{ "status": 0, "infoMessage": "All OK!"}', { semi: false, parser: "json" }));
    }).catch(function(err) {
      console.log('Error @Post: ', err);
      res.send(prettier.format('{ "status": 3, "errorMessage": "Error @Clients Post!"}', { semi: false, parser: "json" }));
    });
  });
});
app.put('/client/:id', jsonParser, (req, res) => {
  const id = req.params.id;
  const item = req.body;
  const clients = mongoose.model('clients', schema);
  console.log('put...');
  clients.updateOne({ id: id }, item).then(function(docs) {
    console.log("Updated Docs : ", docs);
    res.send(prettier.format('{ "status": 0, "infoMessage": "All OK!"}', { semi: false, parser: "json" }));
  }).catch(function(err) {
    console.log(err);
    res.send(prettier.format('{ "status": 3, "errorMessage": "Error @Client Put!"}', { semi: false, parser: "json" }));
  });
});
app.delete('/client/:id', jsonParser, (req, res) => {
  const id = req.params.id;
  const clients = mongoose.model('clients', schema);
  console.log('delete...', id);
  clients.updateOne({ id: id }, { deleted: true }).then(function(docs) {
    console.log("Deleted Doc : ", docs);
    res.send(prettier.format('{ "status": 0, "infoMessage": "All OK!"}', { semi: false, parser: "json" }));
  }).catch(function(err) {
    console.log(err);
    res.send(prettier.format('{ "status": 3, "errorMessage": "Error @Client Delete!"}', { semi: false, parser: "json" }));
  });
});

mongoose.connect('mongodb://127.0.0.1:27017/hairdresser');
mongoose.connection.on('connected', () => console.log('Connected'));
mongoose.connection.on('error', () => console.log('Connection failed with - ', err));
app.listen(port, '0.0.0.0', () => console.log(`Hairdresser: RESTful API Backend App - listening on port ${port}!`));
