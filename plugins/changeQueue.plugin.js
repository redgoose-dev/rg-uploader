function RG_ChangeQueue(options) {

	this.name = 'Change Queue';
	this.sortable = null;

	var self = this;
	var app = null;


	/**
	 * load vendor
	 *
	 * @return {Object|Boolean}
	 */
	function loadVendor()
	{
		var defer = $.Deferred();

		// check loaded vendor
		if (window.loadedVendorSortable)
		{
			defer.resolve();
		}

		var head = document.getElementsByTagName('head')[0];
		var scriptElement = document.createElement('script');

		scriptElement.src = self.options.path_sortable;

		head.appendChild(scriptElement);

		var n = 0;
		var interval = setInterval(function(){
			n++;
			try {
				if (Sortable)
				{
					clearInterval(interval);
					window.loadedVendorSortable = true;
					defer.resolve();
				}
			}
			catch(e) {}
		}, 50);

		return defer.promise();
	}

	/**
	 * end change item event
	 */
	function _change()
	{
		var newIds = [];
		var newFiles = [];
		var index = app.queue.$queue.children('li').map(function(){
			return app.queue.findItem($(this).data('id'));
		});

		for (var i=0; i<index.length; i++)
		{
			newIds.push(app.queue.items.ids[index[i]]);
			newFiles.push(app.queue.items.files[index[i]]);
		}

		app.queue.items.ids = newIds;
		app.queue.items.files = newFiles;

		// callback
		if (self.options.endChangeItem && typeof self.options.endChangeItem === 'function')
		{
			self.options.endChangeItem(app);
		}
	}

	/**
	 * init event
	 */
	function initEvent()
	{
		self.options.vendorOptions.onEnd = _change;

		self.sortable = new Sortable(app.queue.$queue.get(0), self.options.vendorOptions);
	}

	/**
	 * init
	 *
	 * @Param {Object} parent
	 */
	this.init = function(parent)
	{
		app = parent;

		// merge options
		this.assignOption(options);

		// load vendor
		var vendor = loadVendor();

		vendor.done(function(){
			// add class
			app.queue.$queue.addClass('rg-plugin-changeQueue');

			// init event
			initEvent();
		});
	};

	/**
	 * event listener
	 *
	 * @Param {String} type
	 * @Param {*} value
	 */
	this.eventListener = function(type, value)
	{
		switch(type) {
			case 'queue.uploadCompleteAll':
				_change();
				break;
		}
	};

	/**
	 * assignOption
	 *
	 * @Param {Object} obj
	 */
	this.assignOption = function(obj)
	{
		this.options = $.extend(true, this.options, obj);
	}
}


RG_ChangeQueue.prototype.options = {
	path_sortable : '../vendor/Sortable/Sortable.min.js',
	vendorOptions : {
		animation : 150,
	},
	endChangeItem : function(app) {}
};