// load modules
const util = require('./Util.js');
const Queue = require('./Queue.js');
const Uploader = require('./Uploader.js');


/**
 * class RGUploader
 *
 * @param {Object} options
 */
window.RGUploader = function(options) {

	// set self
	const self = this;

	// set options
	this.options = $.extend({}, this.defaultOptions, options);

	/**
	 * @var {int} cuttentSize
	 */
	this.currentSize = 0;


	/**
	 * update size
	 *
	 * @Param {int} current
	 */
	this.updateSize = (size) => {

		let $con = this.$container;

		this.currentSize += size;

		let current = util.bytesToSize(this.currentSize);
		let total = util.bytesToSize(this.options.limitSizeTotal);

		util.findDOM($con, 'text', 'currentSize').text(current);
		util.findDOM($con, 'text', 'totalSize').text(total);
	};


	// ACTION
	if (this.options.$container.length)
	{
		// set container element
		this.$container = this.options.$container.eq(0);

		// init sub modules
		this.queue = new Queue(this);
		this.uploader = new Uploader(this);

		// import queue datas
		if (this.options.queue.datas.length)
		{
			this.queue.import(this.options.queue.datas);
		}

		// update size
		this.updateSize(this.queue.getSize());

		if (this.options.init)
		{
			this.options.init(this);
		}
	}
};



/*****************************
 * M E T H O D
 *****************************/

/**
 * default options
 */
RGUploader.prototype.defaultOptions = {

};
