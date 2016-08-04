// load modules
const Util = require('./Util.js');
const Queue = require('./Queue.js');
const Uploader = require('./Uploader.js');
const Plugin = require('./Plugin.js');
const lang = require('./Language.js');


/**
 * class RGUploader
 *
 * @param {Object} $con container element
 * @param {Object} options
 */
window.RGUploader = function($con, options) {

	/**
	 * @var {Object} this.options
	 */
	this.options = $.extend({}, this.defaultOptions, options);
	if (options && options.queue)
	{
		this.options.queue = $.extend({}, this.defaultOptions.queue, options.queue);
	}


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

	// check $container element
	if (!$con || !$con.length) return;

	// set container element
	this.$container = $con.eq(0);

	// init sub modules
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
 * @Var {Object} RGUploader.defaultOptions
 */
RGUploader.prototype.defaultOptions = {
	autoUpload : false,
	$externalFileForm : null,
	allowFileTypes : ['jpeg', 'png', 'gif'],
	limitSize : 1000000,
	limitSizeTotal : 3000000,
	uploadScript : null,
	removeScript : null,
	eventPrefixName : 'RG-',
	queue : {
		height : 150,
		limit : 10,
		style : 'list',
		buttons : [
			{
				name : 'remove queue',
				iconName : 'close',
				action : function(app, file) {
					app.queue.removeQueue(file.id, false, true);
				}
			}
		]
		,datas : null
	},
	plugin : [],
	// upload progress
	uploadProgress : function(response, file) {},
	// upload complete
	uploadComplete : function(file) {},
	// upload fail
	uploadFail : function(file) {},
	// app init
	init : function(app) {}
};

/**
 * @Var {Object} RGUploader.util
 */
RGUploader.prototype.util = Util;

/**
 * @Var {Function} RGUploader.lang
 */
RGUploader.prototype.lang = lang;

/**
 * @Var {Object} RGUploader.plugins
 */
RGUploader.prototype.plugins = {};
