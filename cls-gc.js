// process.env.DEBUG_CLS_HOOKED = true;
('use strict');
let createNamespace = require('cls-hooked').createNamespace;
let session = createNamespace('benchmark');

async function t3() {}
function t2() {
  t3();
}
function t1() {
  for (let i = 0; i < 500; i++) {
    session.run(t2);
    try {
      if (global.gc) {
        global.gc();
        console.log('garbage collection ran');
      }
    } catch (e) {
      console.log('`node --expose-gc index.js`');
      process.exit();
    }
  }
}
t1();

function t5() {
  for (let i = 0; i < 1000; i++) {
    // Check the _context here, should have length of at least 500
    session.run(t2);
    try {
      if (global.gc) {
        global.gc();
        console.log('garbage collection ran');
      }
    } catch (e) {
      console.log('`node --expose-gc index.js`');
      process.exit();
    }
  }
}
t5();

setTimeout(() => {
  console.log('here');
  // Check the _context here, length should be 0
  session.run(t2);
}, 3000);
