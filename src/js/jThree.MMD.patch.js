var remote = require('remote');
var fs = remote.require('fs');

(function() {

var loadBuffer, toArrayBuffer, MMD;
MMD = THREE.MMD;

toArrayBuffer = function (buffer) {
  var ab = new ArrayBuffer(buffer.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buffer.length; ++i) {
      view[i] = buffer[i];
  }
  return ab;
};

loadBuffer = function( url, onload ) {
  fs.readFile(url, function (err, buf) {
    if (err) {
      var xhr = new XMLHttpRequest();
      xhr.onload = function() {
        if ( xhr.status === 200 ) {
          onload( xhr );
        } else {
          console.error( url, xhr.statusText );
        }
        xhr = null;
      };
      xhr.open( 'GET', url, true );
      xhr.responseType = 'arraybuffer';
      xhr.send();
    } else {
      var arrayBuf = toArrayBuffer(buf);
      onload({response: arrayBuf});
    }
  });
  return;
};

MMD.PMX.prototype.load = function( url, onload ) {
  var that = this;
  loadBuffer( url, function( xhr ) {
    that.url = url;

    that.texturePath = /\//.test( url ) ? url.slice( 0, url.lastIndexOf( "/" ) + 1 ) : '';
    if (!(xhr instanceof XMLHttpRequest)) {
      that.texturePath = "../" + that.texturePath;
    }
    that.parse( xhr.response );
    onload( that );
  });
};

MMD.VMD.prototype.load = function( url, onload ) {
  var that = this;
  loadBuffer( url, function( xhr ) {
    that.url = url;
    that.parse( xhr.response );
    onload( that );
  });
};

}());
