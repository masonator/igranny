var spawn = require('child_process').spawn;

var cecProcess;
var initInterval;

var addresses = {
  self: null,
  active: null
}

var messageHandlers = [
  handleRegisteredNotice,
  handleInactiveNotice,
  handleActiveNotice,
  handleScan
];

function connect() {
  cecProcess = spawn('cec-client', ['-d', '4']);
  cecProcess.stdout.on('data', dispatchHandlers);
}

function isInitialised() {
  return addresses.self !== undefined &&
         addresses.active !== undefined;
}

function getActiveAddress() {
  cecProcess.stdin.write('scan');
}

function isSelfActive() {
  return isInitialised() &&
         addresses.self === addresses.active;
}

function setSelfActive() {
  cecProcess.stdin.write('as');
}

function setSelfInactive() {
  cecProcess.stdin.write('is');
}

function toggleSelfActive() {
  isSelfActive() ? setSelfInactive() : setSelfActive();
}

function dispatchHandlers(data) {
  var messages = data.toString().split('\n');

  for(var i in messages) {
    var message = messages[i];

    for(var j in messageHandlers) {
      messageHandlers[j](message);
    }
  }
}

function handleRegisteredNotice(message) {
  var match = message.match(/CEC client registered\:.+logical address\(es\) = (.+?) ,/);

  if (match) {
    addresses.self = match[1];
    getActiveAddress();
  }
}

function handleActiveNotice(message) {
  var match = message.match(/>> source activated: (.+?)$/);

  if (match) {
    addresses.active = match[1];
  }
}

function handleInactiveNotice(message) {
  var match = message.match(/>> source deactivated: (.+?)$/);

  if (match) {
    addresses.active = 'unknown';
  }
}

function handleScan(message) {
  var match = message.match(/currently active source: (.+?)$/);

  if (match) {
    addresses.active = match[1];
  }
}

function onExit() {
  if (cecProcess) {
    cecProcess.kill();
  }
}

process.on('exit', onExit);
process.on('SIGINT', onExit);
process.on('uncaughtException', onExit);

module.exports = {
  connect: connect,
  toggleSelfActive: toggleSelfActive
}
