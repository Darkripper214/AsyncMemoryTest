const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();
const asyncHooks = require('async_hooks');
const store = new Map();
const fs = require('fs');
const util = require('util');
// We can't console log inside asyncHook, use debug instead
function debug(...args) {
  fs.writeFileSync(1, `${util.format(...args)}\n`, { flag: 'a' });
}
let total = 0;
const asyncHook = asyncHooks.createHook({
  init: (asyncId, _, triggerAsyncId) => {
    if (store.has(triggerAsyncId)) {
      store.set(asyncId, store.get(triggerAsyncId));
    }
  },
  destroy: (asyncId) => {
    if (store.has(asyncId)) {
      store.delete(asyncId);
      total += 1;
    }
    debug('asyncID destroyed: ', asyncId, ' total: ', total);
  },
});

asyncHook.enable();

const createRequestContext = (requestId = uuidv4()) => {
  store.set(asyncHooks.executionAsyncId(), requestId);
};

const getRequestContext = () => {
  return store.get(asyncHooks.executionAsyncId());
};

app.use((req, res, next) => {
  createRequestContext();
  next();
});

// // See currently active item in context (Special for each HTTP req)
// app.get('/ns', (req, res) => {
//   console.log(session.active);
//   res.json({ ns: session.active });
// });

app.get('/', (req, res) => {
  res.json({ user: getRequestContext() });
});

app.listen(3000, () => {
  console.log('running at 3000');
});
