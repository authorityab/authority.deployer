//var Gpio = require('onoff').Gpio;
//var sleep = require('thread-sleep');
//var LPD8806 = require('lpd8806');
var fs = require('fs'),
	microtime = require('microtime'),
	nanotimer = require('nanotimer')

module.exports = {
	trigger: function() {
		
		var num_pixels,
			pixel_buffer,
			off_buffer,
			device;

		//strip = new LPD8806(32, '/dev/spidev0.1');

		//LPD8806.setPixelColor(1, LPD8806.color(255, 0, 0));

		//Animations = new Animations(32);
/*		var _step = 0;
		ledCount = 32;
		start = 0;

		setInterval(function(){
			for(var i = 0; i < 384; i++){
		        var amt = 1;
		        for(var p = 0; p < ledCount; p++){
		            var color = (p + _step) % 384;
		            strip.setPixel(start + p, strip.wheel_color(color));
		        }
		        sleep(50);
		        strip.update();

		        _step += amt;
		        var overflow = _step - 384;
		        if(overflow >= 0){
		            _step = overflow;
		        }
	        }
	    }, 2000);
		        
		strip.allOFF();*/



		function LedStripe(){
		    this.spiDevice = '/dev/spidev0.0';
			this.numLEDs = 32;
			this.spiFd = null; //filedescriptor for spidevice
			this.gamma = 2.5;
			this.gammatable = new Array(256);
			this.bytePerPixel = 3; //RGB
			this.rowResetTime = 1000; // number of us CLK has to be pulled low (=no writes) for frame reset
		    						  // manual of WS2801 says 500 is enough, however we need at least 1000
		    this.lastWriteTime = microtime.now()-this.rowResetTime-1; //last time something was written to SPI
		    														  //required for save WS2801 reset
			this.sendRgbBuf = null; //function for writing to stripe, depends on stripe type    														  
		}

		LedStripe.prototype = {

			/*
			 * connect to SPI port
			 */
		    connect: function(numLEDs,stripeType,spiDevice, gamma){
		    	// sanity check for params
		    	if ((numLEDs !== parseInt(numLEDs)) || (numLEDs<1)) {
		    		console.error("invalid param for number of LEDs, plz use integer >0");
		    		return false;
		    	}
		    	if ((stripeType != 'WS2801') && (stripeType != 'LPD8806')){
		    		console.error("invalid param for stripe type, only WS2801 and LPD8806 are suported");
		    		return false;
		    	}
		    	if (spiDevice) this.spiDevice = spiDevice;
				// connect synchronously
				try{
					this.spiFd = fs.openSync(this.spiDevice, 'w');
				} catch (err) {
					console.error("error opening SPI device "+this.spiDevice, err);
					return false;
				}
				this.sendRgbBuf = (stripeType == 'WS2801') ? this.sendRgbBufWS2801 : this.sendRgbBufLPD8806;
				this.numLEDs = numLEDs;
				this.gamma = gamma ? gamma : 2.5; //set gamma correction value
				// compute gamma correction table
				for (var i=0; i<256; i++)
					this.gammatable[i] = Math.round(255*Math.pow(i/255, this.gamma));
				//console.log("gammatable" + this.gammatable);
		    },

		    /*
		     * disconnect from SPI port
		     */
		    disconnect : function(){
		    	if (this.spiFd) fs.closeSync(this.spiFd);
		    },

		    sendRgbBufLPD8806 : function(buffer){
		    	var bufSize = this.numLEDs * this.bytePerPixel;
		    	if (buffer.length != bufSize) {
		    		console.log ("buffer length (" + buffer.lenght +" byte) does not match LED stripe size ("+
		    			         this.numLEDs + " LEDs x " + this.bytePerPixel + " colors)");
		    		return;
		    	} // end if (buffer.length != bufSize)
		    	if (this.spiFd) {
		    		var numLeadingZeros = Math.ceil(this.numLEDs / 32); //number of zeros to "reset" LPD8806 stripe
		    		// mind the last zero byte for latching the last blue LED
		    		var aBuf = new Buffer (numLeadingZeros + bufSize + 1);
		    		// prime the stripe with zeros
		    		for (var i=0; i<numLeadingZeros; i++){
		    			aBuf[i] =0x00;
		    		};
		    		// transform color values
		    		for (var i=0; i<(bufSize); i+=3){
				     	var r = (this.gammatable[buffer[i+0]]>>1)+0x80;
				     	var g = (this.gammatable[buffer[i+1]]>>1)+0x80;
				     	var b = (this.gammatable[buffer[i+2]]>>1)+0x80;
					 	aBuf[i+numLeadingZeros+0]=g;
					 	aBuf[i+numLeadingZeros+1]=r;
					 	aBuf[i+numLeadingZeros+2]=b;
					};
					// trailing zero
					aBuf[bufSize+numLeadingZeros] = 0x00;
					fs.writeSync(this.spiFd, aBuf, 0, aBuf.length, null);
		    	} //end if (this.spiFd)
		    }, // end sendRgbBufLPD8806

		    /*
		     * send buffer with RGB values to LPD 8806 stripe
			 */
			sendRgbBufWS2801 : function(buffer){
				// checking if enough time passed for resetting stripe
				if (microtime.now() > (this.lastWriteTime + this.rowResetTime)){
					// yes, its o.k., lets write
					// but first do gamma correction
					var adjustedBuffer = new Buffer(buffer.length);
					for (var i=0; i < buffer.length; i++){
						adjustedBuffer[i]=this.gammatable[buffer[i]];
					}
		    		fs.writeSync(this.spiFd, adjustedBuffer, 0, buffer.length, null);
		    		this.lastWriteTime = microtime.now();
		    		return true;
		  		}
		  		console.log('writing to fast, data dropped');
		  		return false;	
			}, // end sendRgbBufWS2801


			/*
			 * fill whole stripe with one color
			 */
		    fill : function(r,g,b){
		    	if (this.spiFd) {
			    	var bufSize = this.numLEDs * this.bytePerPixel;
			    	var aBuf = new Buffer(bufSize);
			    	for (var i=0; i<(bufSize); i+=3){
						aBuf[i+0]=r;
					 	aBuf[i+1]=g;
					 	aBuf[i+2]=b;
					}
					this.sendRgbBuf(aBuf);
				}    	
		    }, //end fill

		    /*
		     * play an animation from RGB buffer 
		     * - buffersize must be a multiple of one frame
		     * - delay between frames is given in microtimers format,
		     *   e.g. 10m for 10 milliseconds 
		     */
			animate : function(buffer,frameDelay, callback){
			  var row = 0;
			  var rows = buffer.length/(this.numLEDs*this.bytePerPixel);
			  if (rows != Math.ceil(rows)) {
			  	console.log("buffer size is not a multiple of frame size");
			  	return false;
			  }
			  var myTimer = new nanotimer();
			  console.log("Writing " + rows + " rows for " + this.numLEDs + " LEDs with delay " + frameDelay);
			  myTimer.setInterval(function(){
			    if (row>=rows){
			      myTimer.clearInterval();
			      if (callback)
				      callback();
			    } else {
			    	this.sendRgbBuf(buffer.slice(row * this.numLEDs * this.bytePerPixel, (row + 1) * this.numLEDs * this.bytePerPixel));	
					row++;
			    }
			    }.bind(this), null, frameDelay, function(err) {
			      if(err) {
			         //error
			      }
			  });
			} //end animate
		}

		var myLedStripe = new LedStripe();
		myLedStripe.connect(32, 'LPD8806', '/dev/spidev0.1');

		 // do some fancy stuff
	    myLedStripe.fill(0xFF, 0x00, 0x00);
	    console.log("red");
	    setTimeout(function(){
	        myLedStripe.fill(0x00, 0xFF, 0x00);
	        console.log("green")}, 1000);
	    setTimeout(function(){
	        myLedStripe.fill(0x00, 0x00, 0xFF);
	        console.log("blue")}, 2000);
	    setTimeout(function(){
	        myLedStripe.fill(0xFF, 0xFF, 0xFF);
	        console.log("white")}, 3000);
	    setTimeout(doFancyColors, 4000);

	 

	    function doFancyColors(){
	        // o.k., lets do some colorful animation
	        console.log("all colors are beautiful \\o/")
	        var myDisplayBuffer = new Buffer(32*3);
	        var animationTick = 0.005;
	        var angle = 0;
	        var ledDistance = 0.3;
	        setInterval(function(){
	          angle = (angle < Math.PI * 2) ? angle : angle - Math.PI*2;
	          for (var i=0; i<myDisplayBuffer.length; i+=3){
	            //red
	            myDisplayBuffer[i] = 128 + Math.sin(angle + (i/3)*ledDistance) * 128;
	            //green
	            myDisplayBuffer[i+1] = 128 + Math.sin(angle * -5 + (i/3)*ledDistance) * 128;
	            //blue
	            myDisplayBuffer[i+2] = 128 + Math.sin(angle * 7 + (i/3)*ledDistance) * 128;
	          }
	          myLedStripe.sendRgbBuf(myDisplayBuffer);
	          angle+=animationTick;
	        },5);
	    }; // end doFancyColors

	}	
};



