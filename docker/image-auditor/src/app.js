//const config = require("./config.js");
//const dgram =  require("dgram");
//const tcp =  require("net");
//
//const timeout = 5000;
//
////ask by the teacher, don't change 
//const port = 2205;
////the map having the sound, then the instrument 
//const sound_instrument= new Map(config.SOUNDS);
//
//const tcpSocket = tcp.createServer();
//const udpSocket = dgram.createSocket('udp4');
//
////composed of uuid, {instrument, firstPing, lastPing} 
//let musicians = new Map();
//
//udpSocket.on('message', function(msg, source)	{
//	console.log("instrument heard\n");
//	let message = JSON.parse(message);
//	let m = musicians.get(message.uuid);
//	let now = Date.now();
//	
//	//m is not undefined it means, that .get found a result, we update that lastPing
//	if (m != undefined && m.lastPing - now <= timeout){
//		musicians.set(message.uuid,{instrument:m.instrument, firstPing:m.firstPing, lastPing:now});
//	}else{//we have no musician OR it timed out and wasn't cleaned
//		let instr = sound_instrument.get(message.sound);
//		musicians.set(message.uuid,{instrument:instr,firstPing:now,lastPing:now});
//	}
//
//});
//
//udpSocket.bind(config.PORT, function(){
//	console.log("Listening on multicast : " + config.ADDR + ":" +config.PORT)
//	udpSocket.addMembership(config.ADDR);
//});
//
//
//tcpSocket.listen(port);
//tcpSocket.on('connection', function(socket) {
//	var now = Date.now();
//	musicians.forEach((k,v)=> {
//		if(v.lastPing - now > timeout)
//			musicians.delete(k);
//	});
//	let msg = JSON.stringify((Array.from(musicians)).map(([k,v]) => {
//		return {uuid:k, instrument:v.instrument , activeSince: new Date(v,firstPing) };	
//	}));
//	socket.write(msg);
//	socket.write("\r\n");
//	socket.end();
//
//});
//
//const protocol = require('./sensor-protocol');

/*
 * We use a standard Node.js module to work with UDP
 */
const dgram = require('dgram');

/* 
 * Let's create a datagram socket. We will use it to listen for datagrams published in the
 * multicast group by thermometers and containing measures
 */
const s = dgram.createSocket('udp4');
s.bind(2233, function() {
  console.log("Joining multicast group");
  s.addMembership('239.255.22.5');
	console.log("multicast joint");
});

/* 
 * This call back is invoked when a new datagram has arrived.
 */
s.on('message', function(msg, source) {
	console.log("Data has arrived: " + msg + ". Source port: " + source.port);
});
