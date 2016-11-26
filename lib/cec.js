var cmd = require('node-cmd');

function getAddress(done) {
  console.log('get address');

  cmd.get('echo "self" | cec-client -d 1', function (data) {
    console.log('ga data', data);

    var matches = data.match(/\d+/);

    if (!matches || !matches.length) {
      done(null);
    }

    done(matches[0]);
  });
}

function getStatus(done) {
  console.log('get status');

  getAddress(function (address) {
    console.log('got address', address);

    cmd.get('echo "self" | cec-client -d 1', function (data) {
      console.log('gs')
    });
  });
}

function setActiveSource(done) {
  console.log('setting active');
  cmd.get('echo "as" | cec-client -d 1', done);
}

function setInactiveSource(done) {
  console.log('setting inactive');
  cmd.get('echo "is" | cec-client -d 1', done);
}

function toggleActiveSource() {
  console.log('toggle');

  getStatus(function (status) {
    console.log('status', status);

    status ? setInactiveSource() : setActiveSource();
  })
}

module.exports = {
  getAddress: getAddress,
  getStatus: getStatus,
  setActiveSource: setActiveSource,
  setInactiveSource: setInactiveSource,
  toggleActiveSource: toggleActiveSource
}
