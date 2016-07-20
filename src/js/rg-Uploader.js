// load modules
const Util = require('./Util.js');
const Queue = require('./Queue.js');
const Uploader = require('./Uploader.js');
const Plugin = require('./Plugin.js');
const lang = require('./Language.js');


/**
 * class RGUploader
 *
 * @param {Object} options
 */
window.RGUploader = function(options) {

	// set self
	const self = this;

	/**
	 * @var {Object} cuttentSize
	 */
	this.options = $.extend({}, this.defaultOptions, options);

	// check $container element
	if (!this.options.$container || !this.options.$container.length) return null;

	/**
	 * @var {int} cuttentSize
	 */
	this.currentSize = 0;

	/**
	 * event receiver
	 *
	 * @Param {String} type
	 * @Param {*} value
	 */
	this.eventReceiver = (type, value) => {
		let eventListener = this.plugin.eventListener;
		if (!eventListener || !(typeof eventListener === 'function')) return false;
		eventListener(type, value);
	};


	// set container element
	this.$container = this.options.$container.eq(0);

	// init sub modules
	this.util = Util;
	this.lang = lang;
	this.plugin = new Plugin(this);
	this.queue = new Queue(this);
	this.uploader = new Uploader(this);

	// init plugin
	this.plugin.init();

	// play init(external)
	if (this.options.init)
	{
		this.options.init(this);
	}
};


/**
 * default options
 */
RGUploader.prototype.defaultOptions = {

};
