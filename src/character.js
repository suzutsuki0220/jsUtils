const re_full_alphanumeric_and_symbol = /[！-～]/g;  // included /[Ａ-Ｚａ-ｚ０-９／]/
const re_half_alphanumeric_and_symbol = /[!-~]/g;
const re_half_katakana = /[｡-ﾟ]/g;  // 半角カナと点や丸などの幾つかの記号

function chr(code) {
    return String.fromCodePoint(code);
}

function doReReplace(re, codeLift, string) {
    return string.replace(re, function(s) {
        return String.fromCharCode(s.charCodeAt(0) + codeLift);
    });
}

module.exports.escapeControlChar = function(code) {
    if ((0 <= code && code <=31) || code === 127 || (128 <= code && code <= 159)) {
        return '.';
    }

    return chr(code);
};

module.exports.chr = chr;

module.exports.normalizeHyphen = function(string) {
    return string.replace(/[－—–−‒─―ｰ━‐]/g, '-');
}

module.exports.toHalfWidthLetter = function(string) {
    return doReReplace(re_full_alphanumeric_and_symbol, -0xFEE0, string)
           .replace(/　/g, ' ');
};

module.exports.toFullWidthLetter = function(string) {
    return doReReplace(re_half_alphanumeric_and_symbol, 0xFEE0, string)
           .replace(/ /g, '　');
};

module.exports.toFullWidthKatakana = function(string) {
    const kanaStartCode = 0xFF61;
    const kanamap = [
        '。','「','」','、','・','ヲ','ァ','ィ','ゥ','ェ','ォ','ャ','ュ','ョ','ッ','ー', // ｡｢｣､･ｦｧｨｩｪｫｬｭｮｯｰ
        'ア','イ','ウ','エ','オ','カ','キ','ク','ケ','コ','サ','シ','ス','セ','ソ', // ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿ
        'タ','チ','ツ','テ','ト','ナ','ニ','ヌ','ネ','ノ','ハ','ヒ','フ','ヘ','ホ', // ﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎ
        'マ','ミ','ム','メ','モ','ヤ','ユ','ヨ',      // ﾏﾐﾑﾒﾓﾔﾕﾖ
        'ラ','リ','ル','レ','ロ','ワ','ン','゛','゜'  // ﾗﾘﾙﾚﾛﾜﾝﾞﾟ
    ];

    return string.replace(re_half_katakana, function(s) {
        return kanamap[s.charCodeAt(0) - kanaStartCode];
    });
};
