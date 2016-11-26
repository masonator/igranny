var keys = require('./lib/keys.js');
var cec  = require('./lib/cec.js');

cec.connect();

var KEY_NEXT   = 'n';
var KEY_PREV   = 'p';
var KEY_TOGGLE = 't';

function next() {
  console.log('next');
}

function prev() {
  console.log('prev');
}

keys.init();
keys.registerKey(KEY_NEXT, next);
keys.registerKey(KEY_PREV, prev);
keys.registerKey(KEY_TOGGLE, cec.toggleSelfActive);
