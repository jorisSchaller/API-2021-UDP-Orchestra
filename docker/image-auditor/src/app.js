const config = require("./config.js");
const dgram =  require("dgram");
const tcp =  require("net");

const timeout = 5000;

//ask by the teacher, don't change 
const port = 2205;
//the map having the sound, then the instrument 
const sound_instrument= new Map(config.SOUNDS);

const tcpSocket = tcp.createServer();
const udpSocket = dgram.createSocket('udp4');

//composed of uuid, {instrument, firstPing, lastPing} 
let musicians = new Map();

udpSocket.on('message', function(msg, source)	{
	let message = JSON.parse(msg);
  console.log("Sound heard : "+ message.sound);

	let m = musicians.get(message.uuid);
	let now = Date.now();
	
	//m is not undefined it means, that .get found a result, we update that lastPing
	if (m != undefined && now - m.lastPing <= timeout){
		musicians.set(message.uuid,{instrument:m.instrument, firstPing:m.firstPing, lastPing:now});
	}else{//we have no musician OR it timed out and wasn't cleaned
		let instr = sound_instrument.get(message.sound);
		musicians.set(message.uuid,{instrument:instr,firstPing:now,lastPing:now});
	}

});

udpSocket.bind(config.PORT, function(){
	console.log("Listening on multicast : " + config.ADDR + ":" +config.PORT)
	udpSocket.addMembership(config.ADDR);
});


tcpSocket.listen(port);
tcpSocket.on('connection', function(socket) {
	var now = Date.now();
  //javascript does forEach by value,Index but the index of a map is it's key therefore iterating by value key
	musicians.forEach((v,k)=> {
    console.log({k,v});
		if( now - v.lastPing > timeout){
			musicians.delete(k);
      console.log("deleted k");
    }
	});
	let msg = JSON.stringify((Array.from(musicians)).map(([k,v]) => {
		return {uuid:k, instrument:v.instrument , activeSince: new Date(v.firstPing) };	
	}));
	socket.write(msg);
	socket.write("\r\n");
	socket.end();

});
