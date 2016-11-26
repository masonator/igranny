var NodeCec = require('node-cec').NodeCec;
var CEC     = require('node-cec').CEC;

var cec = new NodeCec( 'node-cec-monitor' )

cec.once('ready', function (client) {
  console.log(' -- READY -- ');
  client.sendCommand(0xf0, CEC.Opcode.GIVE_DEVICE_POWER_STATUS);
)

cec.on('ROUTING_CHANGE', function (packet, fromSource, toSource) {
  console.log( 'Routing changed', fromSource, toSource )
})

// -m  = start in monitor-mode
// -d8 = set log level to 8 (=TRAFFIC) (-d 8)
// -br = logical address set to `recording device`
cec.start( 'cec-client', '-m', '-d', '8', '-b', 'r' )
