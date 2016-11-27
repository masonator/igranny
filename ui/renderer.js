var cec   = require('../lib/cec');
var drive = require('../lib/drive');

var photoPath;
var keyMap = {
  27: quit,
  37: prev,
  39: next,
  84: toggle
};

document.onkeydown = function(event) {
  var handler = keyMap[event.keyCode] || noop;
  handler();
};

document.addEventListener("DOMContentLoaded", init);

function init() {
  cec.connect();
  drive.setPath('../files');
  drive.pull(1);

  next();
}

function setPhoto(path) {
  var img = new Image();
  img.onload = function () {
    document.getElementById('photo').style.backgroundImage = 'url(' + path + ')';
  }
  img.src = path;
}

function next() {
  photoPath = drive.getNextPath(photoPath);
  setPhoto(photoPath);
}

function prev() {
  photoPath = drive.getPrevPath(photoPath);
  setPhoto(photoPath);
}

function toggle() {
  cec.toggleSelfActive();
}

function quit() {
  window.close();
}

function noop() {};
