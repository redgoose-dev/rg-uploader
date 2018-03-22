/**
 * create key code object
 * make keylist to keycode object
 *
 * @Param {Array} list
 * @Return {Object}
 */
const createKeyCodeObject = (list) => {
	let result = {};
	list = list || [];

	list.forEach((item) => {
		if (!item.key || !item.code) return false;
		result[item.key] = item.code;
	});

	return result;
};


/**
 * Keyboard Event
 *
 * @Param {String} eventPrefix
 * @Param {Array} keyList
 */
module.exports = function(eventPrefix, keyList) {
	/**
	 * @Const {String} EVENT_PREFIX
	 */
	const EVENT_PREFIX = eventPrefix;

	/**
	 * @Const {Object} KEY_CODE
	 */
	const KEY_CODE = createKeyCodeObject(keyList);

	/**
	 * @Var {int} pressKeyCode
	 */
	this.pressKeyCode = null;

	/**
	 * @Var {Boolean} isPressKeyCode
	 */
	this.isPressKeyCode = false;

	/**
	 * key down event
	 *
	 * @Param {Object} e
	 */
	const keyDown = (e) => {
		this.pressKeyCode = e.keyCode;
		this.isPressKeyCode = ((e.keyCode === KEY_CODE.ctrl) || (e.keyCode === KEY_CODE.cmd));

		// set event
		$(window)
			.off('keydown.' + EVENT_PREFIX)
			.on('keyup.' + EVENT_PREFIX, keyUp);
	};

	/**
	 * key up event
	 *
	 * @Param {Object} e
	 */
	const keyUp = (e) => {
		this.pressKeyCode = null;
		this.isPressKeyCode = false;

		// set event
		$(window)
			.off('keyup.' + EVENT_PREFIX)
			.on('keydown.' + EVENT_PREFIX, keyDown);
	};

	// init event
	$(window).on('keydown.' + EVENT_PREFIX, keyDown);
};