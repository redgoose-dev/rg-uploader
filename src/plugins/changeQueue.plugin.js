(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(require('jquery'));
	} else {
		root.RG_SizeInfo = factory(jQuery);
	}
}(this, function($) {

	function RG_ChangeQueue(options) {

		this.name = 'Change Queue';
		this.sortable = null;

		var self = this;
		var app = null;


		/**
		 * load vendor Sortable
		 *
		 * @return {Object|Boolean}
		 */
		function loadVendorSortable()
		{
			var defer = $.Deferred();

			if (self.options.class_sortable && self.options.class_sortable.name === 'Sortable')
			{
				window.loadedVendorSortable = true;
				window.Sortable = self.options.class_sortable;
				// 약간의 딜레이가 필요함.
				setTimeout(defer.resolve, 100);
				return defer.promise();
			}

			// check loaded vendor
			if (window.loadedVendorSortable)
			{
				defer.resolve();
			}
			else
			{
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
			}

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
			this.options = this.assignOption(options);

			// load vendor
			var vendor = loadVendorSortable();

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
			return $.extend(true, this.options, obj);
		}
	}

	RG_ChangeQueue.prototype.options = {
		class_sortable: null,
		path_sortable: 'https://cdn.jsdelivr.net/npm/sortablejs@1.6.1/Sortable.min.js',
		vendorOptions: {
			animation: 150,
		},
		endChangeItem: null, // function(app) {}
	};

	return RG_ChangeQueue;

}));