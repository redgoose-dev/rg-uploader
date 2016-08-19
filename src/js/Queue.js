// load modules
const util = require('./Util.js');
const KeyboardEvent = require('./KeyboardEvent.js');
const lang = require('./Language.js');
const template = require('./Template.js');


module.exports = function Queue(parent) {

	/**
	 * @var {String} this.name
	 */
	this.name = 'Queue';

	/**
	 * @var {Object} this.options
	 */
	this.options = parent.options.queue;

	/**
	 * @var {Object} this.items
	 */
	this.items = { ids: [], files: [] };

	/**
	 * @var {String} this.style
	 */
	this.style = 'list';

	/**
	 * @var {Object} this.$queue
	 */
	this.$queue = util.findDOM(parent.$container, 'element', 'queue').children('ul');


	/**
	 * @var {Object} keyboardEvent
	 */
	var keyboardEvent = new KeyboardEvent(
		parent.options.eventPrefixName,
		[
			{ key : 'ctrl', code : 17 },
			{ key : 'cmd', code : 91 }
		]
	);

	/**
	 * init
	 */
	var init = () => {
		// set queue height
		util.findDOM(parent.$container, 'comp', 'queue').height(this.options.height);

		// set style
		this.changeStyle(this.options.style);

		// import queue datas
		if (this.options.datas)
		{
			this.import(this.options.datas);
		}
	};

	/**
	 * init select queue event
	 *
	 * @Param {Object} $el
	 */
	var initSelectQueueEvent = ($el) => {
		let handler = 'click';
		var selectedClassName = 'selected';

		$el.on(handler, (e) => {
			let $this = $(e.currentTarget);
			if (keyboardEvent.isPressKeyCode)
			{
				$this.toggleClass(selectedClassName);
			}
			else
			{
				let isSelected = $this.hasClass(selectedClassName);
				this.$queue.children().removeClass(selectedClassName);
				if (!isSelected)
				{
					$this.addClass(selectedClassName);
				}
			}

			// send event to plugin
			parent.eventReceiver('queue.selectQueue', { $selectElement : $el });
		});
	};

	/**
	 * create navigation buttons
	 *
	 * @Param {Object} options
	 * @Param {Object} file
	 */
	var createNavigationButtons = (options, file) => {
		if (!options || !options.length) return false;

		var $buttons = [];
		options.forEach((item) => {

			if (!item.name || !item.iconName || !item.action) return;
			if (item.show && item.show(file) == false) return;

			let className = (item.className) ? ' class="' + item.className + '"' : '';
			let $item = $('<button type="button" title="' + item.name + '"' + className + '>' +
				'<i class="material-icons">' + item.iconName + '</i>' +
				'</button>');
			$item.on('click', (e) => {
				item.action(parent, file);
				e.stopPropagation();
			});

			$buttons.push($item);
		});

		return $buttons;
	};


	/**
	 * find item
	 *
	 * @Param {int} id
	 * @Return {int}
	 */
	this.findItem = (id) => {
		return this.items.ids.indexOf(id);
	};

	/**
	 * change style
	 *
	 * @Param {String} styleName
	 */
	this.changeStyle = (styleName) => {
		this.style = styleName;
		this.$queue.removeClass().addClass('style-' + styleName);

		// send event to plugin
		parent.eventReceiver('queue.changeStyle', { style : styleName });
	};

	/**
	 * import
	 *
	 * @Param {Array|String} src
	 */
	this.import = (src) => {
		if (!src) return false;

		if (typeof src === 'string')
		{
			$.get(src, (res) => {
				if (typeof res === 'string')
				{
					try {
						res = JSON.parse(res);
					} catch(e) {
						res = [];
					}
				}
				res.forEach((item) => {
					this.addComplete(item);
				});
			});
		}
		else if (src instanceof Array)
		{
			src.forEach((item) => {
				this.addComplete(item);
			});
		}
	};

	/**
	 * delete queue
	 *
	 * @Param {Array} ids
	 */
	this.delete = (ids) => {
		if (!ids || !ids.length) return;

		ids.forEach((id) => {
			this.removeQueue(id, false, true);
		});
	};

	/**
	 * select queue element
	 *
	 * @Param {String} id
	 * @Return {Object}
	 */
	this.selectQueueElement = (id) => {
		return this.$queue.children('li[data-id=' + id + ']');
	};

	/**
	 * add queue
	 *
	 */
	this.add = (file) => {
		// set file values
		file.fullSrc = parent.options.srcPrefixName + file.src;

		this.items.ids.push(file.id);
		this.items.files.push(file);
	};

	/**
	 * remove queue
	 *
	 */
	this.remove = (id) => {
		let n = this.findItem(id);
		this.items.ids.splice(n, 1);
		this.items.files.splice(n, 1);
	};

	/**
	 * add progress queue
	 *
	 * @Param {Object} file
	 */
	this.addProgress = (file) => {
		let $item = $(template.loading);
		let $removeButton = util.findDOM($item, 'element', 'removeQueue').children('button');

		// add item in queue index
		this.add(file);

		// input meta
		$item.attr('data-id', file.id);
		util.findDOM($item, 'text', 'filename').text(file.name);

		// reset percentage
		util.findDOM($item, 'element', 'progress').width('0%').find('em').text('0');

		// init remove queue event
		$removeButton.on('click', (e) => {
			var id = parseInt($(e.currentTarget).closest('li').data('id'));
			this.removeQueue(id, true, false);
			parent.uploader.readyItems.forEach((item, n) => {
				if (item.id == id)
				{
					parent.uploader.readyItems.splice(n, 1);
					return false;
				}
			});
		});

		// append element
		this.$queue.append($item);

		// send event to plugin
		parent.eventReceiver('queue.addProgress', { $el: $item, file: file });
	};

	/**
	 * add complete queue
	 *
	 * @Param {Object} file
	 * @Param {Object} $beforeElement
	 */
	this.addComplete = (file, $beforeElement) => {
		let id = file.id;
		let $el = $(template.complete);
		let item = this.items.files[this.findItem(id)];

		// set elements in queue
		let $previewImages = util.findDOM($el, 'element', 'previewImage');
		let $customButtons = util.findDOM($el, 'element', 'customButtons');
		let $fileType = util.findDOM($el, 'text', 'filetype');
		let $fileName = util.findDOM($el, 'text', 'filename');
		let $state = util.findDOM($el, 'text', 'state');
		let $fileSize = util.findDOM($el, 'text', 'filesize');

		// add queue index
		this.add(file);

		// set queue id
		$el.attr('data-id', id);

		// insert queue data
		$fileType.text(file.type);
		$fileName.text(file.name);
		$state.text('uploaded');
		$fileSize.text((file.size) ? util.bytesToSize(file.size) : 'none');
		$customButtons.html('');

		// check image and assign preview background
		if (file.type.split('/')[0] == 'image')
		{
			$previewImages.css('background-image', 'url(' + file.fullSrc + ')');
		}

		// set toggle select event
		initSelectQueueEvent($el);

		// create queue navigation buttons
		let $buttons = createNavigationButtons(this.options.buttons, file);
		if ($buttons.length)
		{
			$customButtons.append($buttons);
		}

		// append queue
		if ($beforeElement && $beforeElement.length)
		{
			$beforeElement.after($el);
		}
		else
		{
			this.$queue.append($el);
		}

		// send event to plugin
		parent.eventReceiver('queue.uploadComplete', {
			$selectElement : $el,
			id : id,
			file : file
		});
	};

	/**
	 * add error queue
	 *
	 * @Param {Object} file
	 * @Param {Object} $beforeElement
	 */
	this.addError = (file, $beforeElement) => {
		var id = file.id;
		let $el = $(template.error);

		let $fileType = util.findDOM($el, 'text', 'filetype');
		let $fileName = util.findDOM($el, 'text', 'filename');
		let $state = util.findDOM($el, 'text', 'state');

		// add queue index
		this.add(file);

		// set queue id
		$el.attr('data-id', id);

		$fileType.text(file.type);
		$fileName.text(file.name);
		$state.text(file.message);

		// append error queue
		if ($beforeElement && $beforeElement.length)
		{
			$beforeElement.after($el);
		}
		else
		{
			this.$queue.append($el);
		}

		setTimeout(() => {
			this.removeQueue(id, false, false);
		}, 3000);
	};

	/**
	 * remove queue
	 *
	 * @Param {int} id
	 * @Param {Boolean} isLoadingQueue
	 * @Param {Boolean} useScript
	 */
	this.removeQueue = (id, isLoadingQueue, useScript) => {

		var self = this;
		var removeElement = (id) => {
			this.selectQueueElement(id).fadeOut(400, function() {
				$(this).remove();
				self.remove(id);
				parent.eventReceiver('queue.removeQueue', {});
			});
		};

		if (isLoadingQueue)
		{
			this.selectQueueElement(id).filter('.loading').remove();

			// send event to plugin
			parent.eventReceiver('queue.removeQueue', {});
		}
		else
		{
			let file = this.items.files[this.findItem(id)];

			if (useScript && parent.options.removeScript && !file.isLocalFile)
			{
				// remove parameters filter
				file = util.getFunctionReturn(parent.options.removeParamsFilter, file);

				// play remove file script
				$.post(parent.options.removeScript, file, (res, state) => {
					if (typeof res === 'string')
					{
						try {
							res = JSON.parse(res);
						} catch(e) {
							res = { state : 'error', response : res };
						}
					}

					// filtering response
					res = util.getFunctionReturn(parent.options.removeDataFilter, res);

					// act
					if (res && res.state && res.state == 'success')
					{
						removeElement(id);
					}
					else
					{
						console.log(res.response);
						alert(lang('error_remove_error'));
						return false;
					}
				});
			}
			else
			{
				removeElement(id);
			}
		}
	};

	/**
	 * updare queue
	 *
	 * @Param {Object} res
	 */
	this.updateProgress = (res) => {
		let $el = this.$queue.children('li[data-id=' + res.id + ']');
		let $progress = util.findDOM($el, 'element', 'progress');
		let percent = parseInt((res.data.loaded / res.data.total) * 100);
		$progress.width(percent + '%').find('em').text(percent);

		parent.eventReceiver('queue.updateProgress', {
			$selectElement : $el,
			id: res.id,
			loaded : res.data.loaded,
			total : res.data.total
		});
	};

	/**
	 * upload result
	 *
	 * @Param {String} state (success|error)
	 * @Param {Object} file
	 */
	this.uploadResult = (state, file) => {
		if (!state) return false;
		let $loading = this.selectQueueElement(file.id);
		this.remove(file.id);
		switch(state) {
			case 'success':
				this.addComplete(file, $loading);
				break;
			case 'error':
				this.addError(file, $loading);
				break;
		}
		this.removeQueue(file.id, true);
	};

	/**
	 * get files size (total)
	 *
	 * @Return {int}
	 */
	this.getSize = () => {
		var size = 0;
		this.items.files.forEach((item) => {
			size += item.size;
		});
		return size;
	};


	// init event
	init();
};