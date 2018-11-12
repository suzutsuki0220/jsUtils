const datetime_pattern = /(\d{4})[-\/](\d\d)[-\/](\d\d) (\d\d):(\d\d):([\d\.]+)/;

function formatNumber(num, zeros) {
    var ret = "";

    for (var i=0; i<zeros; i++) {
        ret += "0";
    }
    ret += String(num);

    return ret.substr(zeros * -1);
}

function getDateStr(d, delim) {
    const year  = formatNumber(d.getUTCFullYear(), 4);
    const month = formatNumber(d.getUTCMonth() + 1, 2);
    const date  = formatNumber(d.getUTCDate(), 2);

    return year + delim + month + delim + date;
}

function getTimeStr(d, add_msec) {
    const hour  = formatNumber(d.getUTCHours(), 2);
    const min   = formatNumber(d.getUTCMinutes(), 2);
    const sec   = formatNumber(d.getUTCSeconds(), 2);
    const msec  = add_msec ? "." + formatNumber(d.getUTCMilliseconds(), 3) : "";

    return hour + ":" + min + ":" + sec + msec;
}

exports.isValidString = function(datetime_str) {
    return datetime_pattern.test(datetime_str);
};

exports.toUTCString = function(epoc) {
    const d = new Date(epoc);

    return getDateStr(d, "/") + " " + getTimeStr(d, true);
};

exports.toString = function(epoc) {
    const tz_offset_msec = (new Date()).getTimezoneOffset() * 60 * 1000;

    return this.toUTCString(epoc - tz_offset_msec);
};

exports.toRFC3339UTC = function(epoc) {
    const d = new Date(epoc);

    return getDateStr(d, "-") + "T" + getTimeStr(d, false) + "Z";
};

exports.getDateFromDatetimeString = function(datetime_str) {
    var d;

    if (!datetime_str) {
        return NaN;
    }

    var dt_match = datetime_str.match(datetime_pattern);
    if (dt_match === null) {
        return NaN;
    }

    const sec = Math.floor(dt_match[6]);
    const milisec = Math.floor((dt_match[6] * 1000) - (sec * 1000));

    d = new Date(Date.UTC(dt_match[1], dt_match[2] - 1, dt_match[3], dt_match[4], dt_match[5], sec, milisec));

    return d.getTime();  // ミリ秒
};
