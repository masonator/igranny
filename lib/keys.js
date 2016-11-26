var keypress = require('keypress');
var tty      = require('tty');

var keyMap = {
  q: function () {
    process.exit();
  }
};

function init() {
  keypress(process.stdin);

  process.stdin.on('keypress', function (ch, key) {
    if (key && key.name && keyMap[key.name]) {
      keyMap[key.name]();
    }
  });

  if (typeof process.stdin.setRawMode == 'function') {
    process.stdin.setRawMode(true);
  } else {
    tty.setRawMode(true);
  }

  process.stdin.resume();
}

function registerKey(key, callback) {
  keyMap[key] = callback;
}

module.exports = {
  init: init,
  registerKey: registerKey
}
