'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.bytesToSize = bytesToSize;
exports.findDOM = findDOM;
exports.getUniqueNumber = getUniqueNumber;
exports.detectTouchEvent = detectTouchEvent;
exports.inputFileReset = inputFileReset;
exports.getFunctionReturn = getFunctionReturn;
/**
 * byte to size convert
 *
 * @param {Number} bytes
 * @return {String}
 */
function bytesToSize(bytes) {
	var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	if (bytes === 0) return '0';
	var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
	return Math.round(bytes / Math.pow(1024, i), 2) + '' + sizes[i];
}

/**
 * find DOM
 *
 * @param {Object} $con
 * @param {String} key
 * @param {String} name
 * @return {Object}
 */
function findDOM($con, key, name) {
	if (!($con && $con.length)) return null;
	return $con.find('[data-' + key + '=' + name + ']');
}

/**
 * get unique number
 *
 * @param {int} length
 * @return {int}
 */
function getUniqueNumber(length) {
	length = length || 10;

	var timestamp = +new Date();
	var _getRandomInt = function _getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	var ts = timestamp.toString();
	var parts = ts.split("").reverse();
	var id = "";

	for (var i = 0; i < length; ++i) {
		var index = _getRandomInt(0, parts.length - 1);
		id += parts[index];
	}

	return parseInt(id);
}

/**
 * detect touch event
 *
 * @return {Boolean}
 */
function detectTouchEvent() {
	return 'ontouchstart' in document.documentElement;
}

/**
 * reset input[type=file]
 *
 * @param {Object} input
 */
function inputFileReset(input) {
	var win10ie11 = !!navigator.userAgent.match(/Trident.*rv[ :]?[1-9]{2}\./);
	var ie = navigator.appVersion.indexOf("MSIE ") !== -1;
	var ie10 = navigator.appVersion.indexOf("MSIE 10") !== -1;

	if (ie10) {
		// is IE10
		input.type = 'radio';
		input.type = 'file';
	} else if (ie || win10ie11) {
		// is IE
		var orgParent = input.parentNode;
		var orgNext = input.nextSibling;

		var tmp = document.createElement('form');
		tmp.appendChild(input);
		tmp.reset();

		orgParent.insertBefore(input, orgNext);
	} else {
		// etc
		input.value = '';
	}
}

/**
 * get function return
 *
 * @param {Function} func
 * @param {Object} src
 * @param params
 * @return {Object}
 */
function getFunctionReturn(func, src, params) {
	if (!func || !(typeof func === 'function')) return src;
	return func(src, params) || src;
}