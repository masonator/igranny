var exec = require('child_process').exec;

var pullInterval;

function pull(directory, interval) {
  directory = directory || './';

  var _pull = function () {
    console.log('drive: pulling', directory);
    exec('cd ' + directory + ' && drive pull --no-prompt');
  };

  if (interval) {
    clearInterval(pullInterval);
    pullInterval = setInterval(_pull, interval)
  } else {
    _pull();
  }
}

function onExit() {
  clearInterval(pullInterval);
}

process.on('exit', onExit);
process.on('SIGINT', onExit);
process.on('uncaughtException', onExit);

module.exports = {
  pull: pull
};
