// load modules
const Redux = require('Redux');


/**
 * class RGUploader
 *
 * @param {Object} options
 */
window.RGUploader = function(options) {

	// set self
	const self = this;

	// set uploader component
	const uploader = require('./Uploader.js');
	uploader.init(this);

	// set queue component
	const queue = require('./Queue.js');
	queue.init(this);

	// set plugin component
	const plugin = require('./Plugins.js');
	//plugin.init(this);

	// set options
	this.options = $.extend({}, this.defaultOptions, options);

	// set api
	this.api = require('./API.js');
	//this.api.init(this);


	/**
	 * init event
	 *
	 */
	const initEvent = () => {

		// init upload event
		uploader.initEvent();
	};


	/**
	 * appState(redux)
	 *
	 * @param {Object} state
	 * @param {Object} action
	 * @return {Object}
	 */
	this.appState = (state, action) => {
		if (typeof state === 'undefined') return this.defaultState;

		switch(action.type) {
			case 'UPLOAD':
				log('ACT UPLOAD');
				log(state);
				break;
		}

		return state;
	};

	/**
	 * render component
	 * 상태가 변경되면 적용하는 오더를 내린다.
	 *
	 */
	this.render = () => {
		const state = this.store.getState();

	};


	// action
	if (this.options.$container.length)
	{
		// set container element
		this.$container = this.options.$container;

		// run initEvent()
		initEvent();
	}
};



/*****************************
 * M E T H O D
 *****************************/

/**
 * default options
 *
 */
RGUploader.prototype.defaultOptions = {
	uploadScript : null,
	$container : $('.rg-uploader'),
	$externalFileForm : null
};

/**
 * default state
 *
 */
RGUploader.prototype.defaultState = {
	queue : {
		items : []
	}
};

/**
 * init
 *
 */
RGUploader.prototype.init = function() {

	if (!this.options.$container.length) return false;

	// set store
	this.store = Redux.createStore(this.appState);

	// act render
	this.render();

	// subscribe store
	this.store.subscribe(this.render);
};
