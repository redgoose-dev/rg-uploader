import $ from 'jquery';

import * as util from './lib/util';
import defaultOptions from './lib/defaultOptions';
// load modules
// const Queue = require('./Queue.js');
// const Uploader = require('./Uploader.js');
// const Plugin = require('./Plugin.js');
// const lang = require('./Language.js');



// /**
//  * @Var {Object} RGUploader.util
//  */
// RGUploader.prototype.util = util;
//
// /**
//  * @Var {Function} RGUploader.lang
//  */
// RGUploader.prototype.lang = lang;
//
// /**
//  * @Var {Object} RGUploader.plugins
//  */
// RGUploader.prototype.plugins = {};


export default class RGUploader {

	/**
	 * constructor
	 *
	 * @param {Object} $con container element
	 * @param {Object} options
	 */
	constructor($con, options=null)
	{
		// check $container element
		if (!$con || !$con.length) return;

		// merge options
		this.options = { ...defaultOptions, ...options };
		if (options && options.queue)
		{
			this.options.queue = { ...defaultOptions.queue, ...options.queue };
		}

		// set container element
		this.$container = $con.eq(0);

		// init sub modules
		// this.plugin = new Plugin(this);
		// this.queue = new Queue(this);
		// this.uploader = new Uploader(this);

		// // init plugin
		// this.plugin.init();
		//
		// // init queue
		// this.queue.init();
		//
		// // play init(external)
		// if (this.options.init)
		// {
		// 	this.options.init(this);
		// }
	}

	/**
	 * event receiver
	 *
	 * @Param {String} type
	 * @Param {*} value
	 */
	eventReceiver(type, value)
	{
		let eventListener = this.plugin.eventListener;
		if (!eventListener || !(typeof eventListener === 'function')) return false;
		eventListener(type, value);
	}

}