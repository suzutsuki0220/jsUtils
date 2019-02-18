function makeCanvas(size) {
    if (typeof document === 'undefined') {
        const { createCanvas } = require('canvas');
        return createCanvas(size.width, size.height);
    } else {
        return document.createElement('canvas');
    }
}

function makeImage() {
    const i = (typeof document === 'undefined') ? require('canvas').Image : document.Image;
    return new i();
}

module.exports.getScale = function(src_size, target_dimension) {
    if (src_size.width > src_size.height) {
        return target_dimension / src_size.width;
    } else {
        return target_dimension / src_size.height;
    }
};

module.exports.getScaledSize = function(src_size, scale) {
    var ret = new Object();
    ret.width  = Math.floor(src_size.width * scale);
    ret.height = Math.floor(src_size.height * scale);

    return ret;
};

module.exports.getSize = function(base64image, callback) {
    const image = makeImage();
    image.crossOrigin = "Anonymous";
    image.onload = function(event) {
        callback({width: image.width, height: image.height});
    };
    image.src = base64image;
};

module.exports.resize = function(base64image, target_dimension, callback, mime_type) {
    const self = this;

    const image = makeImage();
    image.crossOrigin = "Anonymous";
    image.onload = function(event) {
        const scale = self.getScale(image, target_dimension);
        const dst_size = self.getScaledSize(image, scale);
        const canvas = makeCanvas(dst_size);
        var ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, dst_size.width, dst_size.height);
        callback(canvas.toDataURL(mime_type));
    };
    image.src = base64image;
};