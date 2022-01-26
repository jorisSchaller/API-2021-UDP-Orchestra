const config = require("./config.js")
const dgram = require("dgram");

const { v4: uuidv4 } = require('uuid');
//set the timer 1 s
const REPEAT_TIME = 1000;

//socket 
let s = dgram.createSocket('udp4');
//geeksforgeeks.org/map-in-javascript
const sounds = new Map(config.INSTRUMENTS);
const choosenInstrument =process.argv[2] 
const myUUID = uuidv4();
if(!sounds.has(choosenInstrument )){
	console.error("I can't play this instrument, give me either piano, trumpet,flute,violin,drum");
	process.exit();
}
const sound = sounds.get(choosenInstrument);

function multicastSend(){
	console.log("Multicasting on "+config.ADDR + ":" +config.PORT);
	const data = JSON.stringify({uuid:myUUID,sound:sound})
	s.send(data,config.PORT,config.ADDR);
	console.log("Sent data :"+data);
}
setInterval(multicastSend,REPEAT_TIME);
