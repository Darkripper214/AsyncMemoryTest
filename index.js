const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();
let createNamespace = require('cls-hooked').createNamespace;
let session = createNamespace('benchmark');

app.use((req, res, next) => {
  session.run(() => {
    session.set('user', uuidv4());
    next();
  });
});

// See currently active item in context (Special for each HTTP req)
app.get('/ns', (req, res) => {
  console.log(session.active);
  res.json({ ns: session.active });
});

app.get('/', (req, res) => {
  res.json({ user: session.get('user') });
});

app.listen(3000, () => {
  console.log('running on port 3000');
});
