;(function() {
	RGUploader.prototype.plugins.changeQueueStyle = function ()
	{
		var name = 'Change queue style';
		var app = null;
		var $nav = null;
		var $buttons = null;
		var buttonsParams = [
			{ name : 'list', title : 'list style', iconName : 'menu', default : true },
			{ name : 'web', title : 'web style', iconName : 'view_list', default : false },
			{ name : 'album', title : 'album style', iconName : 'view_module', default : false }
		];


		/**
		 * create buttons
		 */
		var createButtons = function()
		{
			$.each(buttonsParams, function(k, o){
				var $el = $('<button type="button" class="style-' + o.name + '" title="' + o.title + '" data-style="' + o.name + '">' +
					'<i class="material-icons">' + o.iconName + '</i>' +
					'</button>');
				initButtonsEvent($el);
				$nav.append($el);
			});
			$buttons = $nav.children('button');
		};

		/**
		 * init buttons event
		 *
		 * @Param {Object} $el
		 */
		var initButtonsEvent = function($el)
		{
			$el.on('click', function(e){
				if ($(this).hasClass('on')) return false;
				app.queue.changeStyle($(this).data('style'));
			});
		};

		/**
		 * change active button
		 */
		var changeActiveButton = function(name)
		{
			// change style
			$buttons.removeClass('on').filter('.style-' + name).addClass('on');
		};


		// return
		return {
			name : name,
			init : function(parent)
			{
				app = parent;

				// append comp
				$nav = $('<nav data-element="selectQueueStyle"></nav>');
				app.$container.children('header').append($nav);

				// create buttons
				createButtons();

				// set active button
				changeActiveButton(app.queue.style);

			},
			eventListener : function(type, value)
			{
				switch (type) {
					// change style
					case 'queue.changeStyle':
						changeActiveButton(value.style);
						break;
				}
			}
		}
	}
})();