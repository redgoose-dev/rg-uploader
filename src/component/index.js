import $ from 'jquery';
import Uploader from './Uploader';
import Queue from './Queue';
import Plugin from './Plugin';
import * as lib from './lib';

export default class RG_Uploader {

	/**
	 * constructor
	 *
	 * @param {Object} el HTMLElement
	 * @param {Object} options
	 */
	constructor(el, options=null)
	{
		// check container element
		if (!el) return;

		// merge options
		this.options = { ...lib.defaultOptions, ...options };
		if (options && options.queue)
		{
			this.options.queue = { ...lib.defaultOptions.queue, ...options.queue };
		}

		// set container element
		this.$container = $(el);

		// init sub modules
		this.plugin = new Plugin(this);
		this.queue = new Queue(this);
		this.uploader = new Uploader(this);

		// init plugin
		this.plugin.init();

		// init queue
		this.queue.init();

		// play init(external)
		if (this.options.init && typeof this.options.init === 'function')
		{
			this.options.init(this);
		}
	}

	/**
	 * event receiver
	 *
	 * @Param {String} type
	 * @Param {*} value
	 */
	eventReceiver(type, value)
	{
		this.plugin.eventListener(type, value);
	}

}
