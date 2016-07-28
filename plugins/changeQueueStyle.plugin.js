;(function() {

	function ChangeQueueStyle() {

		this.name = 'Change queue style';
		this.buttonsParams = [
			{ name : 'list', title : 'list style', iconName : 'menu', default : true },
			{ name : 'web', title : 'web style', iconName : 'view_list', default : false },
			{ name : 'album', title : 'album style', iconName : 'view_module', default : false }
		];
		this.$nav = null;
		this.$buttons = null;

		var self = this;
		var app = null;


		/**
		 * create buttons
		 */
		var createButtons = function()
		{
			$.each(self.buttonsParams, function(k, o){
				var $el = $('<button type="button" class="style-' + o.name + '" title="' + o.title + '" data-style="' + o.name + '">' +
					'<i class="material-icons">' + o.iconName + '</i>' +
					'</button>');
				initButtonsEvent($el);
				self.$nav.append($el);
			});
			self.$buttons = self.$nav.children('button');
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
			self.$buttons.removeClass('on').filter('.style-' + name).addClass('on');
		};


		/**
		 * init
		 *
		 * @Param {Object} parent
		 */
		this.init = function(parent)
		{
			app = parent;

			// append comp
			self.$nav = $('<nav data-element="selectQueueStyle"></nav>');
			app.$container.children('header').append(self.$nav);

			// create buttons
			createButtons();

			// set active button
			changeActiveButton(app.queue.style);

		};

		/**
		 * event listener
		 *
		 * @Param {String} type
		 * @Param {*} value
		 */
		this.eventListener = function(type, value)
		{
			switch (type) {
				// change style
				case 'queue.changeStyle':
					changeActiveButton(value.style);
					break;
			}
		}
	}

	RGUploader.prototype.plugins.changeQueueStyle = new ChangeQueueStyle();

})();