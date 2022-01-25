//const config = require("./config.js")
//const dgram = require("dgram");
//
//const { v4: uuidv4 } = require('uuid');
////set the timer 1 s
//const REPEAT_TIME = 1000;
//
////socket 
//let s = dgram.createSocket('udp4');
////geeksforgeeks.org/map-in-javascript
//const sounds = new Map(config.INSTRUMENTS);
//const choosenInstrument =process.argv[2] 
//const myUUID = uuidv4();
//if(!sounds.has(choosenInstrument )){
//	console.error("I can't play this instrument, give me either piano, trumpet,flute,violin,drum");
//	process.exit();
//}
//const sound = sounds.get(choosenInstrument);
//
//function multicastSend(){
//	console.log("Multicasting on "+config.ADDR + ":" +config.PORT);
//	const data = JSON.stringify({uuid:myUUID,sound:sound})
//	s.send(data,config.PORT,config.ADDR);
//	console.log("Sent data :"+data);
//}
//setInterval(multicastSend,REPEAT_TIME);
var dgram = require('dgram');

/*
 * Let's create a datagram socket. We will use it to send our UDP datagrams 
 */
var s = dgram.createSocket('udp4');

/*
 * Let's define a javascript class for our thermometer. The constructor accepts
 * a location, an initial temperature and the amplitude of temperature variation
 * at every iteration
 */
function Thermometer(location, temperature, variation) {

	this.location = location;
	this.temperature = temperature;
	this.variation = variation;

/*
   * We will simulate temperature changes on a regular basis. That is something that
   * we implement in a class method (via the prototype)
   */
	Thermometer.prototype.update = function() {
		var delta = this.variation - (Math.random() * this.variation * 2);
		this.temperature = (this.temperature + delta);

/*
	  * Let's create the measure as a dynamic javascript object, 
	  * add the 3 properties (timestamp, location and temperature)
	  * and serialize the object to a JSON string
	  */
		var measure = {
			timestamp: Date.now(),
			location: this.location,
			temperature: this.temperature
		};
		var payload = JSON.stringify(measure);

/*
	   * Finally, let's encapsulate the payload in a UDP datagram, which we publish on
	   * the multicast address. All subscribers to this address will receive the message.
	   */
		message = new Buffer(payload);
		s.send(message, 0, message.length, 2233, '239.255.22.5', function(err, bytes) {
			console.log("Sending payload: " + payload + " via port " + s.address().port);
		});

	}

/*
	 * Let's take and send a measure every 500 ms
	 */
	setInterval(this.update.bind(this), 500);

}

/*
 * Let's get the thermometer properties from the command line attributes
 * Some error handling wouln't hurt here...
 */
var location = process.argv[2];
var temp = parseInt(process.argv[3]);
var variation = parseInt(process.argv[4]);

/*
 * Let's create a new thermoter - the regular publication of measures will
 * be initiated within the constructor
 */
var t1 = new Thermometer(location, temp, variation);
