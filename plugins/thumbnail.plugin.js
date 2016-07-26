// croppie : http://foliotek.github.io/Croppie/

;(function() {
	RGUploader.prototype.plugins.thumbnail = function ()
	{
		var name = 'Create thumnail image';
		var app = null;
		var $el = {
			con : null,
			wrap : null,
			bg : null,
			figure : null,
			meta : null,
			btn_close : null,
			btn_done : null
		};
		var option = {
			width : 640,
			height : 480,
			mobileSize : 640,
			uploadScript : './script/upload_base64.php',
			output : {
				type : 'canvas',
				quality : .3,
				format : 'jpeg',
				size : { width : 150, height : 150 }
			}
		};
		var RESIZE_EVENT = 'resize.rgUploader';
		var isMobile = false;
		var resizeInterval = null;
		var croppie = null;
		var file = null;

		option.croppie = {
			boundary : { width: option.width, height: option.height-60 },
			viewport : { width: 150, height: 150, type: 'square' }
		};

		/**
		 * load external vendor files
		 */
		function loadExternalFiles()
		{
			var head = document.getElementsByTagName('head')[0];
			var cssEl = document.createElement('link');
			var scriptEl = document.createElement('script');

			cssEl.rel = 'stylesheet';
			cssEl.href = '../vendor/croppie/croppie.css';
			scriptEl.src = '../vendor/croppie/croppie.min.js';

			head.appendChild(cssEl);
			head.appendChild(scriptEl);
		}

		/**
		 * create container
		 */
		function createContainer()
		{
			// set elements
			$el.con = $('<div class="rg-plugin-thumbnail">' +
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
			$el.wrap = $el.con.children('.wrap');
			$el.bg = $el.con.children('.bg');
			$el.figure = $el.con.find('.img-wrap figure');
			$el.meta = $el.con.find('.meta > p');
			$el.btn_done = $el.con.find('.btn-done');
			$el.btn_close = $el.con.find('.btn-close');

			// insert element
			$('body').append($el.con);
		}

		/**
		 * init events
		 */
		function initEvents()
		{
			// close in background
			$el.bg.on('click', close);

			// close in close button
			$el.btn_close.on('click', close);

			// done
			$el.btn_done.on('click', done);

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
			$el.wrap
				.width('100%').height('100%')
				.css({ marginLeft : 0, marginTop : 0, left: 0, top: 0 });

			// rebuild croppie
			if (croppie)
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
			$el.wrap
				.width(option.width).height(option.height)
				.css({
					marginLeft : (0 - option.width * 0.5) + 'px',
					marginTop : (0 - option.height * 0.5) + 'px',
					left: '50%',
					top: '50%'
				});

			// rebuild croppie
			if (croppie)
			{
				rebuildCroppie(true);
			}
		}

		/**
		 * resize event
		 *
		 * @Param {Object} e
		 */
		function resize(e)
		{
			var $win = $(window);

			if (!croppie)
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
		 * @Param {Boolean} isResize
		 */
		function rebuildCroppie(isResize)
		{
			// save option
			var save = (isResize) ? croppie.get() : {};

			// destroy croppie
			destroyCroppie();

			// build croppie
			option.croppie.boundary = {
				width : (option.mobileSize > $(window).width()) ? $(window).width() : option.width,
				height : ((option.mobileSize > $(window).width()) ? $(window).height() : option.height)-60
			};
			croppie = new Croppie($el.figure.get(0), option.croppie);

			// bind croppie
			if (isResize)
			{
				croppie.bind({
					url : file.src,
					points : save.points
				});
				croppie.setZoom(save.zoom);
			}
		}

		/**
		 * destroy croppie
		 */
		function destroyCroppie()
		{
			if (croppie)
			{
				croppie.destroy();
				croppie = null;
			}
		}

		/**
		 * open window
		 *
		 * @Param {Object} obj
		 */
		function open(obj)
		{
			// show window
			$el.con.addClass('show');

			// set file value
			file = obj;

			// act pc & mobile
			if ($(window).width() < option.mobileSize)
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
			croppie.bind({ url : file.src });

			// input state
			$el.meta.text('output size: ' + option.output.size.width + '*' + option.output.size.height);
		}

		/**
		 * close window
		 */
		function close()
		{
			destroyCroppie();
			file = null;
			$el.con.removeClass('show');
		}

		/**
		 * done event
		 *
		 * @Param {Object} e
		 */
		function done(e)
		{
			// result
			croppie.result(option.output).then(function(res){
				$('#result').append('<img src="' + res + '" alt="">');

				if (option.uploadScript)
				{
					$.post(
						option.uploadScript,
						{
							name : file.name,
							image : res,
							id : app.util.getUniqueNumber()
						},
						function(res){
							try {
								res = JSON.parse(res);
							} catch (e) {
								alert('parse error');
								return false;
							}
							if (res.state == 'error')
							{
								alert(res.message);
								return false;
							}

							// import thumnail
							app.queue.import([res.response]);
						});
				}
				else
				{
					app.queue.import([{
						id : app.util.getUniqueNumber(),
						name : 'thumb-' + file.name,
						src : res,
						type : 'image/' + option.output.format,
						size : 0
					}]);
				}

				// close
				close();
			});
		}


		// return
		return {
			name : name,
			init : function(parent)
			{
				app = parent;

				// load files
				loadExternalFiles();

				// create container
				createContainer();

				// init events
				initEvents();
			},
			open : open,
			close : close
		}
	}
})();