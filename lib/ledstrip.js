var fs = require('fs');
var microtime = require('microtime');

  var spiDevice = '/dev/spidev0.0';
  var numLEDs = 32;
  var spiFd = null; //filedescriptor for spidevice
  var gamma = 2.5;
  var gammatable = new Array(256);
  var bytePerPixel = 3; //RGB
  var rowResetTime = 1000; // number of us CLK has to be pulled low (=no writes) for frame reset
  var animationInterval;
  var animationDurationTimeout;
  // manual of WS2801 says 500 is enough, however we need at least 1000
  var lastWriteTime = microtime.now() - rowResetTime - 1; //last time something was written to SPI

  //required for save WS2801 reset
  var sendRgbBuf = null; //function for writing to strip, depends on  type
  var isConnected =  false;

module.exports = {


  init: function() {
    this.connect();
    this.fill(0x00, 0x00, 0xFF);
  },

  /*
   * connect to SPI port
   */
  connect: function() {
    numLEDs = 32;
   // stripType = 'LPD8806';
    spiDevice = '/dev/spidev0.1';
    gamma = 2.5;

    // sanity check for params
    if ((numLEDs !== parseInt(numLEDs)) || (numLEDs < 1)) {
      console.error("invalid param for number of LEDs, plz use integer >0");
      return false;
    }
   /* if ((stripType != 'WS2801') && (stripType != 'LPD8806')) {
      console.error("invalid param for strip type, only WS2801 and LPD8806 are suported");
      return false;
    }*/
    if (spiDevice) spiDevice = spiDevice;
    // connect synchronously
    try {
      spiFd = fs.openSync(spiDevice, 'w');
    } catch (err) {
      console.error("error opening SPI device " + spiDevice, err);
      return false;
    }
  //  sendRgbBuf = (stripType == 'WS2801') ? this.sendRgbBufWS2801 : this.sendRgbBufLPD8806;
    numLEDs = numLEDs;
    gamma = gamma ? gamma : 2.5; //set gamma correction value
    // compute gamma correction table
    for (var i = 0; i < 256; i++)
      gammatable[i] = Math.round(255 * Math.pow(i / 255, gamma));

    isConnected = true;
  },

  /*
   * disconnect from SPI port
   */
  disconnect: function() {
    this.fill(0x00, 0x00, 0x00);
    clearInterval(animationInterval);
    clearTimeout(animationDurationTimeout);

    if (spiFd)
      fs.closeSync(spiFd);

    isConnected = false;
  },

  sendRgbBufLPD8806: function(buffer) {
    if (!isConnected)
      this.connect();

    var bufSize = numLEDs * bytePerPixel;
    if (buffer.length != bufSize) {
      console.log("buffer length (" + buffer.lenght + " byte) does not match LED strip size (" +
        numLEDs + " LEDs x " + bytePerPixel + " colors)");
      return;
    }
    if (spiFd) {
      var numLeadingZeros = Math.ceil(numLEDs / 32); //number of zeros to "reset" LPD8806 strip
      // mind the last zero byte for latching the last blue LED
      var aBuf = new Buffer(numLeadingZeros + bufSize + 1);
      // prime the strip with zeros
      for (var i = 0; i < numLeadingZeros; i++) {
        aBuf[i] = 0x00;
      };
      // transform color values
      for (var i = 0; i < (bufSize); i += 3) {
        var r = (gammatable[buffer[i + 0]] >> 1) + 0x80;
        var g = (gammatable[buffer[i + 1]] >> 1) + 0x80;
        var b = (gammatable[buffer[i + 2]] >> 1) + 0x80;
        aBuf[i + numLeadingZeros + 0] = g;
        aBuf[i + numLeadingZeros + 1] = r;
        aBuf[i + numLeadingZeros + 2] = b;
      };
      // trailing zero
      aBuf[bufSize + numLeadingZeros] = 0x00;
      fs.writeSync(spiFd, aBuf, 0, aBuf.length, null);
    }
  },

  /*
   * send buffer with RGB values to LPD 8806 strip
   */
  sendRgbBufWS2801: function(buffer) {
    if (!isConnected)
      this.connect();

    // checking if enough time passed for resetting strip
    if (microtime.now() > (lastWriteTime + rowResetTime)) {
      // yes, its o.k., lets write
      // but first do gamma correction
      var adjustedBuffer = new Buffer(buffer.length);
      for (var i = 0; i < buffer.length; i++) {
        adjustedBuffer[i] = gammatable[buffer[i]];
      }
      fs.writeSync(spiFd, adjustedBuffer, 0, buffer.length, null);
      lastWriteTime = microtime.now();
      return true;
    }
    console.log('writing to fast, data dropped');
    return false;
  },


  /*
   * fill whole strip with one color
   */
  fill: function(r, g, b) {
    if (spiFd) {
      var bufSize = numLEDs * bytePerPixel;
      var aBuf = new Buffer(bufSize);
      for (var i = 0; i < (bufSize); i += 3) {
        aBuf[i + 0] = r;
        aBuf[i + 1] = g;
        aBuf[i + 2] = b;
      }
      this.sendRgbBufLPD8806(aBuf);
    }
  },

  animate: function(redVal, greenVal, blueVal, redAngAmp, greenAngAmp, blueAngAmp, animationTick, duration) {
    var myDisplayBuffer = new Buffer(32 * 3);
    var angle = 0;
    var ledDistance = 0.3;
    var self = this;
    animationInterval = setInterval(function() {
      angle = (angle < Math.PI * 2) ? angle : angle - Math.PI * 2;
      for (var i = 0; i < myDisplayBuffer.length; i += 3) {
        //red
        myDisplayBuffer[i] = redVal + Math.sin((angle * redAngAmp) + (i / 3) * ledDistance) * redVal;
        console.log('r: ' + myDisplayBuffer[i])
        //green
        myDisplayBuffer[i + 1] = greenVal + Math.sin((angle * greenAngAmp) + (i / 3) * ledDistance) * greenVal;
        console.log('g: ' + myDisplayBuffer[i + 1])
        //blue
        myDisplayBuffer[i + 2] = blueVal + Math.sin((angle * blueAngAmp) + (i / 3) * ledDistance) * blueVal;
        console.log('b: ' + myDisplayBuffer[i + 2])

        console.log('ledDistance: ' + ledDistance );
      }
      self.sendRgbBufLPD8806(myDisplayBuffer);
      angle += animationTick;
    }, 5);

    if (duration != null) {
      animationDurationTimeout = setTimeout(function() {
        clearInterval(animationInterval);
        self.disconnect();
      }, duration)
    }
  }
};