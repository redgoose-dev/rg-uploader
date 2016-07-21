;(function(){
	RGUploader.prototype.plugins.sizeinfo = function()
	{
		var name = 'sizeinfo';
		var app = null;
		var $body = null;
		var wrapSelector = '.size-info';
		var $current = null;
		var $total = null;
		var size = { current: 0, total: 0 };

		/**
		 * update size
		 *
		 */
		var update = function()
		{
			$current.text(app.util.bytesToSize(size.current));
			$total.text(app.util.bytesToSize(size.total));
		};

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
		}

		return {
			name : name,
			init : function(parent)
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
				size.total = app.options.limitSizeTotal;

				// update size
				update();
			},
			update : update,
			eventListener : function(type, value)
			{
				switch(type) {
					case 'queue.uploadComplete':
						size.current += value.file.size;
						update(app.queue.getSize());
						break;

					case 'queue.removeQueue':
						size.current = app.queue.getSize();
						update();
						break;
				}
			}
		}
	};
})();