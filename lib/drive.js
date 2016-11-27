var exec = require('child_process').exec;
var path = require('path');
var fs   = require('fs');
var mime = require('mime');

var drivePath
var pullInterval;

function setPath(newPath) {
  drivePath = path.join(__dirname, newPath);
}

function getNextPath(filepath) {
  return getPathAtOffset(filepath, 1);
}

function getPrevPath(filepath) {
  return getPathAtOffset(filepath, -1);
}

function getPathAtOffset(filepath, offset) {
  var files = getSortedFiles();
  var index = files.indexOf(filepath) + offset;

  if (index === files.length) {
    index = 0;
  } else if (index < 0) {
    index = files.length - 1;
  }

  return files[index];
}

function pull(intervalMins) {
  var doPull = function () {
    console.log('drive: pulling', drivePath);
    exec('cd ' + drivePath + ' && drive pull --no-prompt');
  };

  if (intervalMins) {
    clearInterval(pullInterval);
    pullInterval = setInterval(doPull, intervalMins * 60 * 1000);
  }

  doPull();
}

function getSortedFiles() {
  return fs.readdirSync(drivePath)
    .map(getFilepath)
    .filter(isImageFile)
    .sort(function(fileA, fileB) {
      return getFileModifiedTime(fileA) - getFileModifiedTime(fileB);
    });
}

function getFileModifiedTime(filepath) {
  return fs.statSync(filepath).mtime.getTime();
}

function getFilepath(filename) {
  return path.join(drivePath, filename)
}

function isImageFile(filepath) {
  return mime.lookup(filepath).indexOf('image/') === 0;
}

function onExit() {
  clearInterval(pullInterval);
}

process.on('exit', onExit);
process.on('SIGINT', onExit);
process.on('uncaughtException', onExit);

module.exports = {
  setPath: setPath,
  pull: pull,
  getNextPath: getNextPath,
  getPrevPath: getPrevPath
};
