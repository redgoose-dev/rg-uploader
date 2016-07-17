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

		// update size
		// TODO : queue가 있으면 임포트하고나서 업데이트하기
		this.updateSize(0);
	}
};



/*****************************
 * M E T H O D
 *****************************/

/**
 * default options
 */
RGUploader.prototype.defaultOptions = {
	uploadScript : '',
	autoUpload : false,
	$container : $('.rg-uploader'),
	$externalFileForm : $('#extUpload'),
	allowFileTypes : ['jpeg', 'png', 'gif', 'json'],
	limitSize : 1000000,
	limitSizeTotal : 5000000,
	eventPrefixName : 'RG-',
	queue : {
		height : 150,
		limit : 5,
		style : 'web',
		buttons : [
			{
				name : '',
				iconName : '',
				action : function() {

				}
			}
		]
	},
	plugin : [
		{}
	],
	uploadProgress : function() {},
	uploadComplete : function() {},
	uploadFail : function() {}
};
