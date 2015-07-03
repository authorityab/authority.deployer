var fs = require('fs');
var microtime = require('microtime');

module.exports = {
  init: function() {
    this.spiDevice = '/dev/spidev0.0';
    this.numLEDs = 32;
    this.spiFd = null; //filedescriptor for spidevice
    this.gamma = 2.5;
    this.gammatable = new Array(256);
    this.bytePerPixel = 3; //RGB
    this.rowResetTime = 1000; // number of us CLK has to be pulled low (=no writes) for frame reset

    // manual of WS2801 says 500 is enough, however we need at least 1000
    this.lastWriteTime = microtime.now() - this.rowResetTime - 1; //last time something was written to SPI

    //required for save WS2801 reset
    this.sendRgbBuf = null; //function for writing to strip, depends on  type

    this.isConnected = false;

    this.connect();
    this.fill(0xFF, 0x00, 0x00);
  }

  /*
   * connect to SPI port
   */
  function connect() {
    numLEDs = 32;
    stripType = 'LPD8806';
    spiDevice = '/dev/spidev0.1';
    gamma = 2.5;

    // sanity check for params
    if ((numLEDs !== parseInt(numLEDs)) || (numLEDs < 1)) {
      console.error("invalid param for number of LEDs, plz use integer >0");
      return false;
    }
    if ((stripType != 'WS2801') && (stripType != 'LPD8806')) {
      console.error("invalid param for strip type, only WS2801 and LPD8806 are suported");
      return false;
    }
    if (spiDevice) this.spiDevice = spiDevice;
    // connect synchronously
    try {
      this.spiFd = fs.openSync(this.spiDevice, 'w');
    } catch (err) {
      console.error("error opening SPI device " + this.spiDevice, err);
      return false;
    }
    this.sendRgbBuf = (stripType == 'WS2801') ? this.sendRgbBufWS2801 : this.sendRgbBufLPD8806;
    this.numLEDs = numLEDs;
    this.gamma = gamma ? gamma : 2.5; //set gamma correction value
    // compute gamma correction table
    for (var i = 0; i < 256; i++)
      this.gammatable[i] = Math.round(255 * Math.pow(i / 255, this.gamma));

    this.isConnected = true;
  },

  /*
   * disconnect from SPI port
   */
  function disconnect() {
    this.fill(0x00, 0x00, 0x00);

    if (this.spiFd)
      fs.closeSync(this.spiFd);

    this.isConnected = false;
  },

  function sendRgbBufLPD8806(buffer) {
    if (!this.isConnected)
      this.connect();

    var bufSize = this.numLEDs * this.bytePerPixel;
    if (buffer.length != bufSize) {
      console.log("buffer length (" + buffer.lenght + " byte) does not match LED strip size (" +
        this.numLEDs + " LEDs x " + this.bytePerPixel + " colors)");
      return;
    }
    if (this.spiFd) {
      var numLeadingZeros = Math.ceil(this.numLEDs / 32); //number of zeros to "reset" LPD8806 strip
      // mind the last zero byte for latching the last blue LED
      var aBuf = new Buffer(numLeadingZeros + bufSize + 1);
      // prime the strip with zeros
      for (var i = 0; i < numLeadingZeros; i++) {
        aBuf[i] = 0x00;
      };
      // transform color values
      for (var i = 0; i < (bufSize); i += 3) {
        var r = (this.gammatable[buffer[i + 0]] >> 1) + 0x80;
        var g = (this.gammatable[buffer[i + 1]] >> 1) + 0x80;
        var b = (this.gammatable[buffer[i + 2]] >> 1) + 0x80;
        aBuf[i + numLeadingZeros + 0] = g;
        aBuf[i + numLeadingZeros + 1] = r;
        aBuf[i + numLeadingZeros + 2] = b;
      };
      // trailing zero
      aBuf[bufSize + numLeadingZeros] = 0x00;
      fs.writeSync(this.spiFd, aBuf, 0, aBuf.length, null);
    }
  },

  /*
   * send buffer with RGB values to LPD 8806 strip
   */
  function sendRgbBufWS2801(buffer) {
    if (!this.isConnected)
      this.connect();

    // checking if enough time passed for resetting strip
    if (microtime.now() > (this.lastWriteTime + this.rowResetTime)) {
      // yes, its o.k., lets write
      // but first do gamma correction
      var adjustedBuffer = new Buffer(buffer.length);
      for (var i = 0; i < buffer.length; i++) {
        adjustedBuffer[i] = this.gammatable[buffer[i]];
      }
      fs.writeSync(this.spiFd, adjustedBuffer, 0, buffer.length, null);
      this.lastWriteTime = microtime.now();
      return true;
    }
    console.log('writing to fast, data dropped');
    return false;
  },


  /*
   * fill whole strip with one color
   */
  function fill(r, g, b) {
    if (this.spiFd) {
      var bufSize = this.numLEDs * this.bytePerPixel;
      var aBuf = new Buffer(bufSize);
      for (var i = 0; i < (bufSize); i += 3) {
        aBuf[i + 0] = r;
        aBuf[i + 1] = g;
        aBuf[i + 2] = b;
      }
      this.sendRgbBuf(aBuf);
    }
  },

  function animate(redVal, greenVal, blueVal, animationTick, duration) {
    var myDisplayBuffer = new Buffer(32 * 3);
    var angle = 0;
    var ledDistance = 0.3;
    var interval = setInterval(function() {
      angle = (angle < Math.PI * 2) ? angle : angle - Math.PI * 2;
      for (var i = 0; i < myDisplayBuffer.length; i += 3) {
        //red
        myDisplayBuffer[i] = 128 + Math.sin(angle + (i / 3) * ledDistance) * redVal;
        //green
        myDisplayBuffer[i + 1] = 128 + Math.sin(angle * -5 + (i / 3) * ledDistance) * greenVal;
        //blue
        myDisplayBuffer[i + 2] = 128 + Math.sin(angle * 7 + (i / 3) * ledDistance) * blueVal;
      }
      this.sendRgbBufLPD8806(myDisplayBuffer);
      angle += animationTick;
    }, 5);

    if (duration != null) {
      setTimeout(function() {
        clearInterval(interval);
        this.disconnect();
      }, duration)
    }
  }
};