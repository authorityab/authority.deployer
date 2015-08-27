var fs = require('fs');

var rowResetTime = 1000; // number of us CLK has to be pulled low (=no writes) for frame reset
var spiDevice = '/dev/spidev0.0';
var numLEDs = 32;
var spiFd = null; //filedescriptor for spidevice
var gamma = 2.5;
var gammatable = new Array(256);
var bytePerPixel = 3; //RGB
var animationInterval = null;
var animationDurationTimeout = null;
var lastWriteTime = Date.now() - rowResetTime - 1; //last time something was written to SPI, manual of WS2801 says 500 is enough, however we need at least 1000
var sendRgbBuf = null; //function for writing to strip, depends on type. required for save WS2801 reset
var isConnected =  false;
module.exports = {

  init: function() {
    this.connect();
    this.fill(0x00, 0x00, 0x00);
  },

  /*
   * connect to SPI port
   */
  connect: function() {
    numLEDs = 32;
    spiDevice = '/dev/spidev0.1';
    gamma = 2.5;

    // sanity check for params
    if ((numLEDs !== parseInt(numLEDs)) || (numLEDs < 1)) {
      console.error("invalid param for number of LEDs, plz use integer >0");
      return false;
    }

    if (spiDevice) spiDevice = spiDevice;

    // connect synchronously
    try {
      spiFd = fs.openSync(spiDevice, 'w');
    } catch (err) {
      console.error("error opening SPI device " + spiDevice, err);
      return false;
    }

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

  hexToRgb: function(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
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
    if (Date.now() > (lastWriteTime + rowResetTime)) {
      // yes, its o.k., lets write
      // but first do gamma correction
      var adjustedBuffer = new Buffer(buffer.length);

      for (var i = 0; i < buffer.length; i++) {
        adjustedBuffer[i] = gammatable[buffer[i]];
      }

      fs.writeSync(spiFd, adjustedBuffer, 0, buffer.length, null);
      lastWriteTime = Date.now();
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

  toggle: function(hexArray, speed) {
    var self = this;
    // var rgb1 = this.hexToRgb(hex1);
    // var rgb2 = this.hexToRgb(hex2);
    var colors = [];

    for (var i = 0; i < hexArray.length; i++) {
      var rgb = this.hexToRgb(hexArray[i]);
      colors.push(rgb);
    }

    var arrPos = 0;

    isRunning = true;
    animationInterval = setInterval(function() {

      self.fill(colors[arrPos].r, colors[arrPos].g, colors[arrPos].b);
      // colors.reverse();
      arrPos++;
      if (arrPos === colors.length) {
        arrPos = 0;
      }

    }, speed);
  },

  pulse: function(hexColor, speed) {
    var self = this;
    var rgb = this.hexToRgb(hexColor);
    var alpha = 0;
    var animationTick;

    animationInterval = setInterval(function() {
      var a = Math.sin(alpha += 0.110);
      a = a < 0 ? a * -1 : a;

      var r = rgb.r * a;
      var g = rgb.g * a;
      var b = rgb.b * a;

      self.fill(r, g, b);
    }, speed);
  },

  pulseShift: function(hexArray, speed) {
    var self = this;
    var orgArray = hexArray;
    var rgb = this.hexToRgb(hexArray[0]);
    var alpha = 0;
    var animationTick;
    var shift;

    animationInterval = setInterval(function() {
      a = Math.sin(alpha += 0.110);

      if (a < 0 ) {
        a = a * -1
        shift = true;
      }

      var r = rgb.r * a;
      var g = rgb.g * a;
      var b = rgb.b * a;

      self.fill(r, g, b);
      console.log('shift: ' + shift);
      if (shift) {
        if (hexArray.length > 0) {
          var hex = hexArray.shift();
	  console.log('hex: ' + hex);
          rgb = self.hexToRgb(hex);
        } else {
          hexArray = orgArray;
          rgb = self.hexToRgb(hexArray[0]);
        }
        shift = false;
      }
    }, speed);


  },

  animate: function(hexColor, redAngAmp, greenAngAmp, blueAngAmp, animationTick, duration) {
    clearInterval(animationInterval);
    clearTimeout(animationDurationTimeout);
    var rgb = this.hexToRgb(hexColor);
    var myDisplayBuffer = new Buffer(32 * 3);
    var angle = 0;
    var ledDistance = 0.3;
    var self = this;
    animationInterval = setInterval(function() {
      angle = (angle < Math.PI * 2) ? angle : angle - Math.PI * 2;
      for (var i = 0; i < myDisplayBuffer.length; i += 3) {
        //red
        myDisplayBuffer[i] = rgb.r + Math.sin((angle * redAngAmp) + (i / 3) * ledDistance) * rgb.r;
        //green
        myDisplayBuffer[i + 1] = rgb.g + Math.sin((angle * greenAngAmp) + (i / 3) * ledDistance) * rgb.g;
        //blue
        myDisplayBuffer[i + 2] = rgb.b + Math.sin((angle * blueAngAmp) + (i / 3) * ledDistance) * rgb.b;
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
