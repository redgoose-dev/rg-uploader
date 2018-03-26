(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define([], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.RG_SizeInfo = factory();
	}
}(this, function() {
	return function RG_SizeInfo() {

		this.name = 'Size info';
		this.size = { current: 0, total: 0 };

		var self = this;
		var app = null;
		var $body = null;
		var wrapSelector = '.size-info';
		var $current = null;
		var $total = null;


		/**
		 * create element
		 *
		 */
		var create = function()
		{
			var str = '<p>Size : <em data-text="currentSize"></em>/<em data-text="totalSize"></em></p>';
			$body.append(str);
			$current = $body.find('[data-text=currentSize]');
			$total = $body.find('[data-text=totalSize]');
		};


		/**
		 * init
		 *
		 * @Param {Object} parent
		 */
		this.init = function(parent)
		{
			app = parent;
			$body = parent.$container.find(wrapSelector);

			// not found $body element
			if (!$body.length)
			{
				app.plugin.error(name);
			}

			// create elements
			create();

			// set size
			this.size.total = app.options.limitSizeTotal;

			// update size
			this.update();
		};

		/**
		 * update
		 */
		this.update = function()
		{
			$current.text(app.util.bytesToSize(this.size.current));
			$total.text(app.util.bytesToSize(this.size.total));
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
				case 'queue.uploadComplete':
					self.size.current += value.file.size;
					self.update(app.queue.getSize());
					break;

				case 'queue.removeQueue':
					self.size.current = app.queue.getSize();
					self.update();
					break;
			}
		}

	}
}));