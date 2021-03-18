const autocannon = require('autocannon');

const instance = autocannon(
  {
    url: 'http://localhost:3000',
    connections: 100, //default
    pipelining: 1, // default
    duration: 30, // default
  },
  console.log
);
// this is used to kill the instance on CTRL-C
process.once('SIGINT', () => {
  instance.stop();
});

// just render results
autocannon.track(instance, { renderProgressBar: true });
