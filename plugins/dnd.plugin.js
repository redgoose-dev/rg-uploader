;(function() {
	RGUploader.prototype.plugins.dnd = function ()
	{
		var name = 'Drag and Drop upload';
		var app = null;
		var areaElements = [];
		var externalAreaElements = $('.rg-external-dropzone');


		/**
		 * init file drag and drop event
		 *
		 * @Param {Array} area
		 * @Return {Object}
		 */
		var fileDragAndDrop = function(area)
		{
			if (!window.File || !window.FileList || !window.FileReader || !window.Blob) return false;
			if (!area.length) return false;

			var defer = $.Deferred();
			var over = false;

			/**
			 * dragover handler
			 *
			 * @Param {Object} e
			 */
			var overHandler = function(e)
			{
				e.stopPropagation();
				e.preventDefault();

				if (e.type == 'dragover')
				{
					if (over) return false;
					over = true;
					$(e.currentTarget).addClass('drop-mode');
					e.dataTransfer.dropEffect = 'copy';
				}
				else
				{
					over = false;
					$(e.currentTarget).removeClass('drop-mode');
				}
				return false;
			};

			/**
			 * drop handler
			 *
			 * @Param {Object} e
			 */
			var dropHandler = function(e)
			{
				e.stopPropagation();
				e.preventDefault();

				overHandler(e);

				var files = (e.dataTransfer) ? e.dataTransfer.files : null;
				if (files && files.length)
				{
					defer.notify(files);
				}
				return false;
			};

			// set events
			for (var i=0; i<area.length; i++)
			{
				area[i].addEventListener('dragover', overHandler, false);
				area[i].addEventListener('dragleave', overHandler, false);
				area[i].addEventListener('drop', dropHandler, false);
			}

			return defer.promise();
		};

		/**
		 * done event
		 *
		 * @Param {FileList} files
		 */
		var done = function(files)
		{
			if (app.uploader.uploading)
			{
				alert(app.lang('error_add_upload'));
				return false;
			}

			// play upload
			app.uploader.play(app.uploader.$uploadElement, (files || []));
		};

		// return
		return {
			name : name,
			init : function(parent)
			{
				app = parent;

				// push area elements
				areaElements.push(app.queue.$queue.parent().get(0));
				externalAreaElements.each(function(){
					areaElements.push(this);
				});

				// init event
				if (areaElements.length)
				{
					var dnd = fileDragAndDrop(areaElements);
					if (dnd && dnd.progress)
					{
						dnd.progress(done);
					}
				}
			}
		}
	}
})();