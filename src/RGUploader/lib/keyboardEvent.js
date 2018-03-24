import $ from 'jquery';


/**
 * create key code object
 * make keylist to keycode object
 *
 * @param {Array} list
 * @return {Object}
 */
function createKeyCodeObject(list)
{
	let result = {};
	list = list || [];

	list.forEach((item) => {
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
export default function(eventPrefix, keyList)
{
	const EVENT_PREFIX = eventPrefix;
	const KEY_CODE = createKeyCodeObject(keyList);

	this.pressKeyCode = null;
	this.isPressKeyCode = false;

	/**
	 * key down event
	 *
	 * @param {Object} e
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
	 * @param {Object} e
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