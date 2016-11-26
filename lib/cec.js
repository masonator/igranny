var spawn = require('child_process').spawn;

var cecProcess;
var selfAddress;
var activeAddress;
var initInterval;

var messageMap = {
  'waiting for input': onConnected,
  'currently active source:': parseActive,
  'Addresses controlled by libCEC:': parseSelf
};

function connect() {
  cecProcess = spawn('cec-client', ['-d', '1']);
  cecProcess.stdout.on('data', parseStdOut);
}

function onConnected() {
  console.log('cec connected');
  initInterval = setInterval(ensureInitialised, 5000);
}

function onExit() {
  if (cecProcess) {
    cecProcess.kill();
  }

  clearInterval(initInterval);
}

function isSelfActive() {
  return isInitialised() &&
         selfAddress === activeAddress;
}

function isInitialised() {
  return selfAddress !== undefined &&
         activeAddress !== undefined;
}

function ensureInitialised() {
  if (activeAddress === undefined) {
    console.log('cec requesting active');
    requestActiveAddress();
  } else if (selfAddress === undefined) {
    console.log('cec requesting self');
    requestSelfAddress();
  } else {
    console.log('cec initialised');
    clearInterval(initInterval);
  }
}

function setSelfActive() {
  console.log('cec setting active', selfAddress, activeAddress);
  cecProcess.stdin.write('as');
}

function setSelfInactive() {
  console.log('cec setting inactive', selfAddress, activeAddress);
  cecProcess.stdin.write('is');
}

function requestActiveAddress() {
  cecProcess.stdin.write('scan');
}

function requestSelfAddress() {
  cecProcess.stdin.write('self');
}

function parseActive(message) {
  var matches = message.match(/\d+/);

  if (matches) {
    activeAddress = matches[0];
    console.log('cec active address is', activeAddress);
  }
}

function parseSelf(message) {
  console.log('self parsing', message);
  var matches = message.match(/\d+/);

  if (matches) {
    selfAddress = matches[0];
    console.log('cec self address is', selfAddress);
  }
}

function getHandlerForMessage(message) {
  for (var prefix in messageMap) {
    if (message.indexOf(prefix) === 0) {
      return messageMap[prefix];
    }
  }
}

function toggleSelfActive() {
  if (!isInitialised()) {
    return;
  }

  isSelfActive() ? setSelfInactive() : setSelfActive();
}

function parseStdOut(data) {
  var messages = data.toString().split('\n');

  for (var i = 0; i < messages.length; i++) {
    var message = messages[i];
    console.log('>>', message);

    var handler = getHandlerForMessage(message);
    handler ? handler(message) : null;
  }
}

process.on('exit', onExit);
process.on('SIGINT', onExit);
process.on('uncaughtException', onExit);

module.exports = {
  connect: connect,
  isInitialised: isInitialised,
  isSelfActive: isSelfActive,
  toggleSelfActive: toggleSelfActive
}
