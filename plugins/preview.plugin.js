;(function(){
	RGUploader.prototype.preview = function()
	{
		var name = 'preview';
		var app = null;
		var $preview = null;
		var classNameNotImage = 'not-image';
		var width = 150;

		/**
		 * create preview
		 */
		var createPreview = function()
		{
			var str = '<div class="col preview"><figure></figure></div>';
			$preview = $(str);

			// set width
			$preview.width(width);

			// append element
			app.$container.find('[data-comp=queue]').prepend($preview);

			// update
			updatePreview();
		};

		/**
		 * update preview
		 *
		 * @Param {String} src
		 */
		var updatePreview = function(src)
		{
			var $figure = $preview.children('figure');
			if (src)
			{
				$figure
					.css('backgroundImage', 'url(\'' + src + '\')')
					.removeClass(classNameNotImage);
			}
			else
			{
				$figure.attr('style', '').addClass(classNameNotImage);
			}
		};

		/**
		 * visible preview
		 *
		 * @Param {Boolean} src
		 */
		var visiblePreview = function(sw)
		{
			if (sw)
			{
				$preview.removeClass('hide');
			}
			else
			{
				$preview.addClass('hide');
			}
		};


		// return
		return {
			name : name,
			init : function(parent)
			{
				app = parent;
				width = parseInt(app.options.queue.height);

				createPreview();
			},
			eventListener : function(type, value)
			{
				switch(type) {
					// select queue
					case 'queue.selectQueue':
						let id = value.$selectElement.data('id');
						let n = app.queue.findItem(id);
						let file = app.queue.items.files[n];
						let src = (value.$selectElement.hasClass('selected') && (file.type.split('/')[0] == 'image')) ? file.src : null;
						updatePreview(src);
						break;

					// change queue style
					case 'queue.changeStyle':
						visiblePreview( (value.style == 'list') );
						break;
				}
			}
		}
	};
})();