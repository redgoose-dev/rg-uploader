'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (eventPrefix, keyList) {
	var _this = this;

	var EVENT_PREFIX = eventPrefix;
	var KEY_CODE = createKeyCodeObject(keyList);

	this.pressKeyCode = null;
	this.isPressKeyCode = false;

	/**
  * key down event
  *
  * @param {Object} e
  */
	var keyDown = function keyDown(e) {
		_this.pressKeyCode = e.keyCode;
		_this.isPressKeyCode = e.keyCode === KEY_CODE.ctrl || e.keyCode === KEY_CODE.cmd;

		// set event
		(0, _jquery2.default)(window).off('keydown.' + EVENT_PREFIX).on('keyup.' + EVENT_PREFIX, keyUp);
	};

	/**
  * key up event
  *
  * @param {Object} e
  */
	var keyUp = function keyUp(e) {
		_this.pressKeyCode = null;
		_this.isPressKeyCode = false;

		// set event
		(0, _jquery2.default)(window).off('keyup.' + EVENT_PREFIX).on('keydown.' + EVENT_PREFIX, keyDown);
	};

	// init event
	(0, _jquery2.default)(window).on('keydown.' + EVENT_PREFIX, keyDown);
};

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * create key code object
 * make keylist to keycode object
 *
 * @param {Array} list
 * @return {Object}
 */
function createKeyCodeObject(list) {
	var result = {};
	list = list || [];

	list.forEach(function (item) {
		if (!item.key || !item.code) return false;
		result[item.key] = item.code;
	});

	return result;
}

/**
 * Keyboard Event
 *
 * @param {String} eventPrefix
 * @param {Array} keyList
 */
;