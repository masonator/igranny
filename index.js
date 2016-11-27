var app = require('electron').app;
var BrowserWindow = require('electron').BrowserWindow;

var path = require('path')
var url = require('url')

var win;

function getFilePath(relativePath) {
  return url.format({
    pathname: path.join(__dirname, relativePath),
    protocol: 'file:',
    slashes: true
  });
}

function createWindow () {
  win = new BrowserWindow();
  win.loadURL(getFilePath('./ui/index.html'));
  win.setFullScreen(true);
  //win.webContents.openDevTools()
  win.on('closed', function () {
    win = null;
  });
}
app.on('ready', createWindow)
