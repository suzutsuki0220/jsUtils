const value = require('./value');

function makeCanvas(size) {
    if (typeof document === 'undefined') {
        const { createCanvas } = require('canvas');
        return createCanvas(size.width, size.height);
    } else {
        return document.createElement('canvas');
    }
}

function makeImage() {
    const i = (typeof Image === 'undefined') ? require('canvas').Image : Image;
    return new i();
}

function load(base64image, onloadFunc) {
    const image = makeImage();
    image.crossOrigin = "Anonymous";
    image.onload = function(e) {
        onloadFunc(image, e)
    };
    image.src = base64image;
}

function isValidSize(size) {
    if (size && isNaN(size.width) === false && isNaN(size.height) === false) {
        if (size.width > 0 && size.height > 0) {
            return true;
        }
    }

    return false;
}

function isLandscape(size) {
    return (size.width >= size.height) ? true : false;
}

function getScaledSize(src_size, scale) {
    var ret = {width: 0, height: 0};

    if (isValidSize(src_size) === true) {
        ret.width  = Math.floor(src_size.width * scale);
        ret.height = Math.floor(src_size.height * scale);
    }

    return ret;
}

function getCenterXY(size) {
    return {
        x: Math.floor(size.width / 2),
        y: Math.floor(size.height / 2)
    };
}

function getScale(src_size, target_dimension) {
    if (isValidSize(src_size) === false) {
        return 0;
    }

    if (src_size.width > src_size.height) {
        return target_dimension / src_size.width;
    } else {
        return target_dimension / src_size.height;
    }
}

module.exports.getCenterXY = getCenterXY;
module.exports.isValidSize = isValidSize;

// 画像が横長であるか
module.exports.isLandscape = isLandscape;

// 画像が縦長であるか
module.exports.isPortrait = function(size) {
    if (size.width === size.height) {
        return true;
    }

    return !(isLandscape(size));
};

module.exports.getAreaSize = function(size) {
    if (isValidSize(size) === false) {
        return 0;
    }

    return size.width * size.height;
};

module.exports.getAspect = function(size) {
    const ratio = value.getGcd(size.width, size.height);
    if(ratio != 0) {
        return {
            x: size.width  / ratio,
            y: size.height / ratio
        };
    }

    return null;
};

// 指定された枠組みに収まる最大のサイズ
module.exports.getMaximumFitSize = function(source_size, area_size) {
    const scale_w = area_size.width / source_size.width;
    const scale_h = area_size.height / source_size.height;

    return getScaledSize(source_size, Math.min(scale_w, scale_h));
};

// 中心に表示するための画像の配置位置(x,y)
module.exports.getCenteringPositionXY = function(source_size, area_size) {
    const source_area = getCenterXY(source_size);
    const center_area = getCenterXY(area_size);

    return {
        x: center_area.x - source_area.x,
        y: center_area.y - source_area.y
    };
};

module.exports.getScale = getScale;
module.exports.getScaledSize = getScaledSize;

module.exports.getSize = function(base64image, callback) {
    load(base64image, function(image, event) {
        callback({width: image.width, height: image.height});
    });
};

module.exports.resize = function(base64image, target_dimension, callback, mime_type = "image/png") {
    load(base64image, function(image, event) {
        const scale = getScale(image, target_dimension);
        const dstSize = getScaledSize(image, scale);
        const canvas = makeCanvas(dstSize);
        var ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, dstSize.width, dstSize.height);
        callback(canvas.toDataURL(mime_type));
    });
};

module.exports.rotate = function(base64image, angleRadian, callback, mime_type = "image/png") {
    load(base64image, function(image, event) {
        const dstSize = {
            width: Math.round(image.height * Math.abs(Math.sin(angleRadian)) + image.width * Math.abs(Math.cos(angleRadian))),
            height: Math.round(image.height * Math.abs(Math.cos(angleRadian)) + image.width * Math.abs(Math.sin(angleRadian)))
        };
        const center = getCenterXY(dstSize);
        const canvas = makeCanvas(dstSize);
        var ctx = canvas.getContext('2d');
        ctx.translate(center.x, center.y);
        ctx.rotate(angleRadian);
        ctx.drawImage(image, -(image.width / 2), -(image.height / 2));
        callback(canvas.toDataURL(mime_type));
    });
};
