var cmd = require('node-cmd');

function getAddress(done) {
  cmd.get('echo "self" | cec-client -d 1', function (data) {
    console.log(data);
  });
}

function setActiveSource(done) {
  cmd.get('echo "as" | cec-client -d 1', done);
}

function setInactiveSource(done) {
  cmd.get('echo "is" | cec-client -d 1', done);
}

module.exports = {
  getAddress: getAddress,
  getStatus: getStatus,
  setActiveSource: setActiveSource,
  setInactiveSource: setInactiveSource,
  toggleActiveSource: toggleActiveSource
}
