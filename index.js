var keys = require('lib/keys.js');
var cec  = require('lib/cec.js');

var KEY_NEXT   = 'n';
var KEY_PREV   = 'p';
var KEY_TOGGLE = 't';

function next() {
  console.log('next');
}

keys.init();
keys.registerKey(KEY_NEXT, next);
