(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(require('jquery'));
	} else {
		root.RG_ChangeQueue = factory(jQuery);
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

				scriptElement.src = self.options.url_sortable;

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
		function change()
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
			self.options.vendorOptions.onEnd = change;

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
					change();
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
		url_sortable: 'https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js',
		vendorOptions: {
			animation: 150,
		},
		endChangeItem: null, // function(app) {}
	};

	return RG_ChangeQueue;

}));
(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(require('jquery'));
	} else {
		root.RG_ChangeQueueStyle = factory(jQuery);
	}
}(this, function($) {

	function RG_ChangeQueueStyle(selector) {

		var self = this;
		var app = null;

		this.name = 'Change Queue Style';
		this.buttonsParams = [
			{ name : 'list', title : 'list style', iconName : 'menu', default : true },
			{ name : 'web', title : 'web style', iconName : 'view_list', default : false },
			{ name : 'album', title : 'album style', iconName : 'view_module', default : false }
		];
		this.$nav = null;
		this.$buttons = null;

		/**
		 * create buttons
		 */
		function createButtons()
		{
			$.each(self.buttonsParams, function(k, o){
				var $el = $('<button type="button" class="style-' + o.name + '" title="' + o.title + '" data-style="' + o.name + '">' +
					'<i class="material-icons">' + o.iconName + '</i>' +
					'</button>');
				initButtonsEvent($el);
				self.$nav.append($el);
			});
			self.$buttons = self.$nav.children('button');
		}

		/**
		 * init buttons event
		 *
		 * @Param {Object} $el
		 */
		function initButtonsEvent($el)
		{
			$el.on('click', function(e){
				if ($(this).hasClass('on')) return false;
				app.queue.changeStyle($(this).data('style'));
			});
		}

		/**
		 * change active button
		 */
		function changeActiveButton()
		{
			self.$buttons.removeClass('on').filter('.style-' + name).addClass('on');
		}

		/**
		 * init
		 *
		 * @Param {Object} parent
		 */
		this.init = function(parent)
		{
			app = parent;

			var $body = !!selector ? $(selector) : app.$container.children('header');

			// append comp
			self.$nav = $('<nav data-element="selectQueueStyle"></nav>');
			$body.append(self.$nav);

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
			switch(type)
			{
				// change style
				case 'queue.changeStyle':
					changeActiveButton(value.style);
					break;
			}
		}
	}

	return RG_ChangeQueueStyle;

}));
(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(require('jquery'));
	} else {
		root.RG_DragAndDrop = factory(jQuery);
	}
}(this, function($) {

	function RG_DragAndDrop(el) {

		this.name = 'Drag And Drop';
		this.areaElements = [];

		var self = this;
		var app = null;


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

				if (e.type === 'dragover')
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
			app.uploader.start(files || []);
		};


		/**
		 * init
		 *
		 * @Param {Object} parent
		 */
		this.init = function(parent)
		{
			app = parent;

			// set external area
			var externalAreaElements = !!el ? $(el) : null;

			// push area elements
			this.areaElements.push(app.queue.$queue.parent().get(0));
			if (externalAreaElements)
			{
				externalAreaElements.each(function(){
					self.areaElements.push(this);
				});
			}

			// init event
			if (this.areaElements.length)
			{
				var dnd = fileDragAndDrop(this.areaElements);
				if (dnd && dnd.progress)
				{
					dnd.progress(done);
				}
			}
		}
	}

	return RG_DragAndDrop;

}));
(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(require('jquery'));
	} else {
		root.RG_Preview = factory(jQuery);
	}
}(this, function($) {

	function RG_Preview() {

		this.name = 'Preview';
		this.$preview = null;

		var self = this;
		var app = null;
		var classNameNotImage = 'not-image';
		var width = 150;


		/**
		 * create preview
		 */
		var createPreview = function()
		{
			var str = '<div class="col preview"><figure></figure></div>';
			self.$preview = $(str);

			// set width
			self.$preview.width(width);

			// append element
			app.$container.find('[data-comp=queue]').prepend(self.$preview);

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
			var $figure = self.$preview.children('figure');
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
				self.$preview.removeClass('hide');
			}
			else
			{
				self.$preview.addClass('hide');
			}
		};


		/**
		 * init
		 *
		 * @Param {Object} parent
		 */
		this.init = function(parent)
		{
			app = parent;

			// get preview width
			width = parseInt(app.options.queue.height || parent.$container.find('.body').height());

			// set container body height
			parent.$container.find('.body').height(width);

			// play create preview
			createPreview();
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
				// select queue
				case 'queue.selectQueue':
					var id = value.$selectElement.data('id');
					var n = app.queue.findItem(id);
					var file = app.queue.items.files[n];
					var src = (value.$selectElement.hasClass('selected') && (file.type.split('/')[0] === 'image')) ? file.fullSrc : null;
					updatePreview(src);
					break;

				// change queue style
				case 'queue.changeStyle':
					visiblePreview( (value.style === 'list') );
					break;
			}
		}
	}

	return RG_Preview;

}));
(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(require('jquery'));
	} else {
		root.RG_SizeInfo = factory(jQuery);
	}
}(this, function($) {

	function RG_SizeInfo(selector) {
		this.name = 'Size info';
		this.size = { current: 0, total: 0 };

		var self = this;
		var app = null;
		var $body = null;
		var $current = null;
		var $total = null;


		/**
		 * create element
		 */
		function create()
		{
			var str = '<p>Size : <em data-text="currentSize"></em>/<em data-text="totalSize"></em></p>';
			$body.append(str);
			$current = $body.find('[data-text=currentSize]');
			$total = $body.find('[data-text=totalSize]');
		}

		/**
		 * byte to size convert
		 *
		 * @param {Number} bytes
		 * @return {String}
		 */
		function bytesToSize(bytes)
		{
			var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
			if (bytes === 0) return '0';
			var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
			return Math.round(bytes / Math.pow(1024, i), 2) + '' + sizes[i];
		}


		/**
		 * init
		 *
		 * @Param {Object} parent
		 */
		this.init = function(parent)
		{
			app = parent;

			if (selector)
			{
				$body = $(selector);
			}
			else
			{
				$body = app.$container.find('.size-info');
			}

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
			$current.text(bytesToSize(this.size.current));
			$total.text(bytesToSize(this.size.total));
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

	return RG_SizeInfo;

}));
// croppie : http://foliotek.github.io/Croppie/

(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(require('jquery'));
	} else {
		root.RG_Thumbnail = factory(jQuery);
	}
}(this, function($) {

	function RG_Thumbnail(options) {

		this.name = 'Make thumbnail';

		var self = this;
		var app = null;
		var RESIZE_EVENT = 'resize.rgUploader';
		var isMobile = false;
		var resizeInterval = null;

		this.file = null;
		this.croppie = null;
		this.$el = {
			con : null,
			wrap : null,
			bg : null,
			figure : null,
			meta : null,
			btn_close : null,
			btn_done : null
		};

		/**
		 * load external vendor files
		 */
		function loadExternalFiles()
		{
			if (window.loadedCroppie) return;

			var head = document.getElementsByTagName('head')[0];
			var isCroppie = (!!self.options.class_croppie && self.options.class_croppie.name === 'Croppie');

			if (isCroppie)
			{
				window.Croppie = self.options.class_croppie;
			}

			if (!isCroppie && self.options.url_croppieJS)
			{
				var scriptEl = document.createElement('script');
				scriptEl.src = self.options.url_croppieJS;
				head.appendChild(scriptEl);
			}

			if (self.options.url_croppieCSS)
			{
				var cssEl = document.createElement('link');
				cssEl.rel = 'stylesheet';
				cssEl.href = self.options.url_croppieCSS;
				head.appendChild(cssEl);
			}

			window.loadedCroppie = true;
		}

		/**
		 * create container
		 */
		function createContainer()
		{
			// set elements
			self.$el.con = $('<div class="rg-plugin-thumbnail">' +
				'<span class="bg"></span>' +
				'<div class="wrap">' +
				'<div class="img-wrap"><figure></figure></div>' +
				'<div class="body">' +
				'<div class="meta"><p>message</p></div>' +
				'<nav>' +
				'<button type="button" class="btn-done"><i class="material-icons">done</i></button>' +
				'<button type="button" class="btn-close"><i class="material-icons">close</i></button>' +
				'</nav>' +
				'</div>' +
				'</div>' +
				'</div>');
			self.$el.wrap = self.$el.con.children('.wrap');
			self.$el.bg = self.$el.con.children('.bg');
			self.$el.figure = self.$el.con.find('.img-wrap figure');
			self.$el.meta = self.$el.con.find('.meta > p');
			self.$el.btn_done = self.$el.con.find('.btn-done');
			self.$el.btn_close = self.$el.con.find('.btn-close');

			// insert element
			$('body').append(self.$el.con);
		}

		/**
		 * init events
		 */
		function initEvents()
		{
			// close in background
			self.$el.bg.on('click', function(){
				self.close();
			});

			// close in close button
			self.$el.btn_close.on('click', function(){
				self.close();
			});

			// done
			self.$el.btn_done.on('click', done);

			// init resize event
			$(window).on(RESIZE_EVENT, resize);
		}

		/**
		 * change mobile
		 */
		function actMobile(pass)
		{
			if (!pass && isMobile) return false;

			// set isMobile
			isMobile = true;

			// change window size
			self.$el.wrap
				.width('100%').height('100%')
				.css({ marginLeft : 0, marginTop : 0, left: 0, top: 0 });

			// rebuild croppie
			if (self.croppie)
			{
				rebuildCroppie(true);
			}
		}

		/**
		 * change desktop
		 */
		function actDesktop(pass)
		{
			if (!pass && !isMobile) return false;

			// set isMobile
			isMobile = false;

			// change window size
			self.$el.wrap
				.width(self.options.width).height(self.options.height)
				.css({
					marginLeft : (0 - self.options.width * 0.5) + 'px',
					marginTop : (0 - self.options.height * 0.5) + 'px',
					left: '50%',
					top: '50%'
				});

			// rebuild croppie
			if (self.croppie)
			{
				rebuildCroppie(true);
			}
		}

		/**
		 * resize event
		 *
		 * @param {Object} e
		 */
		function resize(e)
		{
			var $win = $(window);

			if (!self.croppie)
			{
				clearTimeout(resizeInterval);
				return false;
			}

			if (resizeInterval)
			{
				clearTimeout(resizeInterval);
			}

			resizeInterval = setTimeout(function(){
				// 계속 모바일 사이즈상태일때 실행
				if (isMobile && ($win.width() < 640))
				{
					actMobile(true);
					return false;
				}
				if ($win.width() < 640)
				{
					actMobile(true);
				}
				else if ($win.width() > 640)
				{
					actDesktop(true);
				}
			}, 300);
		}

		/**
		 * rebuild croppie
		 *
		 * @param {Boolean} isResize
		 */
		function rebuildCroppie(isResize)
		{
			// save option
			var save = (isResize) ? self.croppie.get() : {};

			// destroy croppie
			destroyCroppie();

			// build croppie
			self.options.croppie.boundary = {
				width : (self.options.mobileSize > $(window).width()) ? $(window).width() : self.options.width,
				height : ((self.options.mobileSize > $(window).width()) ? $(window).height() : self.options.height)-60
			};
			self.croppie = new Croppie(self.$el.figure.get(0), self.options.croppie);

			// bind croppie
			if (isResize)
			{
				self.rebind({
					src : self.file.fullSrc,
					points : save.points
				}, function(){
					self.croppie.setZoom(save.zoom);
				});
			}
		}

		/**
		 * destroy croppie
		 */
		function destroyCroppie()
		{
			if (self.croppie)
			{
				self.croppie.destroy();
				self.croppie = null;
			}
		}

		/**
		 * done event
		 *
		 * @param {Object} e
		 */
		function done(e)
		{
			// result
			self.croppie.result(self.options.output).then(function(res){
				if (self.options.uploadScript)
				{
					$.post(
						self.options.uploadScript,
						{
							name : self.file.name,
							image : res,
							id : getUniqueNumber()
						},
						function(res){
							try {
								res = JSON.parse(res);
							} catch (e) {
								alert('parse error');
								return false;
							}
							if (res.state === 'error')
							{
								alert(res.response.message);
								return false;
							}

							if (self.options.doneCallback)
							{
								self.options.doneCallback(res.response, app, self.file);
							}
						});
				}
				else
				{
					if (self.options.doneCallback)
					{
						self.options.doneCallback({
							id : getUniqueNumber(),
							name : 'thumb-' + self.file.name,
							src : res,
							type : 'image/' + self.options.output.format,
							size : 0
						}, app, self.file);
					}
				}

				// close
				self.close();
			}, function (error) {
				console.log('ERROR', error);
			});
		}

		/**
		 * get unique number
		 *
		 * @param {int} length
		 * @return {int}
		 */
		function getUniqueNumber(length)
		{
			length = length || 10;

			var timestamp = +new Date;
			var _getRandomInt = function( min, max )
			{
				return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
			};

			var ts = timestamp.toString();
			var parts = ts.split( "" ).reverse();
			var id = "";

			for( var i = 0; i < length; ++i )
			{
				var index = _getRandomInt( 0, parts.length - 1 );
				id += parts[index];
			}

			return parseInt(id);
		}


		/**
		 * init
		 *
		 * @param {Object} parent
		 */
		this.init = function(parent)
		{
			app = parent;

			// merge options
			this.assignOption(options);

			// load files
			loadExternalFiles();

			// create container
			createContainer();

			// init events
			initEvents();
		};

		/**
		 * open window
		 *
		 * @param {Object} file
		 * @param {Object} bind
		 */
		this.open = function(file, bind)
		{
			bind = bind || {};

			// show window
			this.$el.con.addClass('show');
			$('html').addClass('rg-popup');

			// set file value
			this.file = file;

			// act pc & mobile
			if ($(window).width() < this.options.mobileSize)
			{
				actMobile(true);
			}
			else
			{
				actDesktop(true);
			}

			// rebuild croppie
			rebuildCroppie();
			// bind image
			this.rebind({
				src : this.file.fullSrc,
				points : bind.points,
				orientation : bind.orientation
			}, function(){
				self.croppie.setZoom(bind.zoom || 0.1);
			});

			// input state
			this.$el.meta.text('output size: ' + this.options.output.size.width + '*' + this.options.output.size.height);

			// callback open window
			if (this.options.openCallback)
			{
				this.options.openCallback(app);
			}
		};

		/**
		 * close window
		 */
		this.close = function()
		{
			destroyCroppie();
			this.file = null;
			this.$el.con.removeClass('show');
			$('html').removeClass('rg-popup');

			// callback close window
			if (this.options.closeCallback)
			{
				this.options.closeCallback(app);
			}
		};

		/**
		 * rebind
		 *
		 * @param {Object} options
		 * @param {Function} callback
		 */
		this.rebind = function(options, callback)
		{
			this.croppie.bind({
				url : options.src,
				points : (options.points) ? options.points : [],
				orientation : (options.orientation) ? options.orientation : 1
			}, function(){
				if (callback) callback();
			});
		};

		/**
		 * assignOption
		 *
		 * @param {Object} obj
		 */
		this.assignOption = function(obj)
		{
			this.options = $.extend(true, this.options, obj);
		}
	}

	RG_Thumbnail.prototype.options = {
		width : 640,
		height : 480,
		mobileSize : 640,
		class_croppie: null,
		url_croppieCSS : 'https://cdnjs.cloudflare.com/ajax/libs/croppie/2.6.2/croppie.min.css',
		url_croppieJS : 'https://cdnjs.cloudflare.com/ajax/libs/croppie/2.6.2/croppie.min.js',
		uploadScript : '',
		output : {
			type : 'canvas',
			quality : .75,
			format : 'jpeg',
			size : { width : 150, height : 150 }
		},
		croppie : {
			enableOrientation: true,
			boundary : { width: 640, height: 480-60 },
			viewport : { width: 150, height: 150, type: 'square' }
		},
		doneCallback : null,
		openCallback : null,
		closeCallback : null
	};

	return RG_Thumbnail;

}));