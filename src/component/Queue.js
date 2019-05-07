import $ from 'jquery';
import * as lib from './lib';

export default class Queue {

	constructor(parent)
	{
		this.name = 'Queue';
		this.parent = parent;
		this.options = parent.options.queue;
		this.items = { ids: [], files: [] };
		this.style = 'list';
		this.$queue = lib.util.findDOM(parent.$container, 'element', 'queue').children('ul');
		this.keyboardEvent = new lib.keyboardEvent(
			parent.options.eventPrefixName,
			[
				{ key : 'ctrl', code : 17 },
				{ key : 'cmd', code : 91 }
			]
		);
	}

	/**
	 * init
	 */
	init()
	{
		// set queue height
		if (this.options.height)
		{
			lib.util.findDOM(this.parent.$container, 'comp', 'queue').height(this.options.height);
		}

		// set style
		this.changeStyle(this.options.style);

		// import queue datas
		if (this.options.datas)
		{
			this.import(this.options.datas);
		}
	}

	/**
	 * init select queue event
	 *
	 * @param {Object} $el
	 */
	initSelectQueueEvent($el)
	{
		// select queue event
		$el.on('click', (e) => this.selectQueue($(e.currentTarget).data('id')));
	}

	/**
	 * create navigation buttons
	 *
	 * @param {Object} options
	 * @param {Object} file
	 */
	createNavigationButtons(options, file)
	{
		if (!options || !options.length) return;

		let $buttons = [];
		options.forEach((item) => {
			if (!item.name || !item.iconName || !item.action) return;
			if (item.show && item.show(file) === false) return;

			let className = (item.className) ? `class="${item.className}"` : '';
			let $item = $(`<button type="button" title="${item.name}" ${className}>` +
				`<i class="material-icons">${item.iconName}</i>` +
				`</button>`);

			$item.on('click', (e) => {
				item.action(this.parent, file);
				e.stopPropagation();
			});

			$buttons.push($item);
		});

		return $buttons;
	}

	/**
	 * find item
	 *
	 * @param {int} id
	 * @return {int}
	 */
	findItem(id)
	{
	  let n = this.items.ids.indexOf(Number(id));
		return typeof n === 'number' ? n : undefined;
	}

	/**
	 * change style
	 *
	 * @param {String} styleName
	 */
	changeStyle(styleName)
	{
		this.$queue.removeClass(`style-${this.style}`).addClass(`style-${styleName}`);
		this.style = styleName;

		// send event to plugin
		this.parent.eventReceiver('queue.changeStyle', { style : styleName });
	}

	/**
	 * import
	 *
	 * @param {Array|String} src
	 */
	import(src)
	{
		if (!src) return;

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
				if (!(res && res instanceof Array))
				{
					alert(lib.language('error_import'));
					return;
				}
				if (res.length)
				{
					res.forEach((item) => {
						this.addComplete(item);
					});
				}
			});
		}
		else if (src instanceof Array)
		{
			src.forEach((item) => {
				this.addComplete(item);
			});
		}
	}

	/**
	 * delete queue
	 *
	 * @param {Array} ids
	 */
	delete(ids)
	{
		if (!ids || !ids.length) return;

		ids.forEach((id) => {
			this.removeQueue(id, false, true);
		});
	}

	/**
	 * select queue
	 *
	 * @param {number} id
	 */
	selectQueue(id)
	{
		const selectedClassName = 'selected';
		const $queues = this.$queue.children();

		if (id)
		{
			let $el = this.selectQueueElement(id);

			if (this.keyboardEvent.isPressKeyCode)
			{
				$el.toggleClass(selectedClassName);
			}
			else
			{
				let isSelected = $el.hasClass(selectedClassName);
				let selectCount = $queues.filter(`.${selectedClassName}`).length;

				$queues.removeClass(selectedClassName);

				if (!isSelected || selectCount > 1)
				{
					$el.addClass(selectedClassName);
				}
			}
		}
		else
		{
			if ($queues.filter(`.${selectedClassName}`).length > 0)
			{
				$queues.removeClass(selectedClassName);
			}
			else
			{
				$queues.addClass(selectedClassName);
			}
		}

		// send event to plugin
		this.parent.eventReceiver('queue.selectQueue', {
			$selectElements : this.$queue.children(`.${selectedClassName}`),
			$selectElement : id ? this.selectQueueElement(id) : $queues.eq(0),
		});
	}

	/**
	 * select queue element
	 *
	 * @param {String|Number} id
	 * @return {Object}
	 */
	selectQueueElement(id=null)
	{
		return this.$queue.children(`li[data-id=${id}]`);
	}

	/**
	 * add queue
	 */
	add(file)
	{
		// set file values
		file.fullSrc = this.parent.options.srcPrefixName + file.src;

		this.items.ids.push(Number(file.id));
		this.items.files.push(file);
	}

	/**
	 * remove queue
	 */
	remove(id)
	{
		let n = this.findItem(id);
		this.items.ids.splice(n, 1);
		this.items.files.splice(n, 1);
	}

	/**
	 * add progress queue
	 *
	 * @param {Object} file
	 */
	addProgress(file)
	{
		let $item = $(lib.template.loading);
		let $removeButton = lib.util.findDOM($item, 'element', 'removeQueue').children('button');

		// add item in queue index
		this.add(file);

		// input meta
		$item.attr('data-id', file.id);
		lib.util.findDOM($item, 'text', 'filename').text(file.name);

		// reset percentage
		lib.util.findDOM($item, 'element', 'progress').width('0%').find('em').text('0');

		// init remove queue event
		$removeButton.on('click', (e) => {
			const id = parseInt($(e.currentTarget).closest('li').data('id'));
			this.removeQueue(id, true, false);
			this.parent.uploader.readyItems.forEach((item, n) => {
				if (item.id === id)
				{
					this.parent.uploader.readyItems.splice(n, 1);
					return false;
				}
			});
		});

		// append element
		this.$queue.append($item);

		// send event to plugin
		this.parent.eventReceiver('queue.addProgress', { $el: $item, file: file });
	}

	/**
	 * add complete queue
	 *
	 * @param {Object} file
	 * @param {Object} $beforeElement
	 */
	addComplete(file, $beforeElement=null)
	{
		let id = file.id;
		let $el = $(lib.template.complete);

		// set elements in queue
		let $previewImages = lib.util.findDOM($el, 'element', 'previewImage');
		let $customButtons = lib.util.findDOM($el, 'element', 'customButtons');
		let $fileType = lib.util.findDOM($el, 'text', 'filetype');
		let $fileName = lib.util.findDOM($el, 'text', 'filename');
		let $state = lib.util.findDOM($el, 'text', 'state');
		let $fileSize = lib.util.findDOM($el, 'text', 'filesize');

		// add queue index
		this.add(file);

		// set queue id
		$el.attr('data-id', id);

		// insert queue data
		$fileType.text(file.type);
		$fileName.text(file.name);
		$state.text('uploaded');
		$fileSize.text((file.size) ? lib.util.bytesToSize(file.size) : 'none');
		$customButtons.html('');

		// check image and assign preview background
		if (file.type.split('/')[0] === 'image')
		{
			$previewImages.css('background-image', `url(${file.fullSrc})`);
		}

		// set toggle select event
		this.initSelectQueueEvent($el);

		// create queue navigation buttons
		let $buttons = this.createNavigationButtons(this.options.buttons, file);
		if ($buttons && $buttons.length)
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
		this.parent.eventReceiver('queue.uploadComplete', {
			$selectElement : $el,
			id : id,
			file : file
		});
	}

	/**
	 * add error queue
	 *
	 * @param {Object} file
	 * @param {Object} $beforeElement
	 */
	addError(file, $beforeElement)
	{
		const id = file.id;
		const $el = $(lib.template.error);

		const $fileType = lib.util.findDOM($el, 'text', 'filetype');
		const $fileName = lib.util.findDOM($el, 'text', 'filename');
		const $state = lib.util.findDOM($el, 'text', 'state');

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
	}

	/**
	 * remove queue
	 *
	 * @param {Number} id
	 * @param {Boolean} isLoadingQueue
	 * @param {Boolean} useScript
	 */
	removeQueue(id, isLoadingQueue, useScript=false)
	{
		const self = this;
		const parent = this.parent;
		const { options } = parent;

		function removeElement(id)
		{
			self.selectQueueElement(id).fadeOut(400, function() {
				$(this).remove();
				self.remove(id);
				self.parent.eventReceiver('queue.removeQueue', {});
			});
		}

		if (isLoadingQueue)
		{
			this.selectQueueElement(id).filter('.loading').remove();

			// send event to plugin
			this.parent.eventReceiver('queue.removeQueue', {});
		}
		else
		{
			let file = this.items.files[this.findItem(id)];

			if (file < 0)
			{
				console.error('Not found queue id');
				return false;
			}

			if (useScript && options.removeScript && !file.isLocalFile)
			{
				// remove parameters filter
        if (lib.util.checkFunction(options.removeParamsFilter))
        {
          file = options.removeParamsFilter(file, this.parent);
        }

				// play remove file script
				$.ajax({
					url: lib.util.getFunctionReturn(options.removeScriptFunc, options.removeScript, file),
					type: 'post',
					data: file,
					headers: options.removeHeaders ? options.removeHeaders : ((options.uploadHeaders) ? options.uploadHeaders : null),
					success: function(res, state) {
						if (typeof res === 'string')
						{
							try {
								res = JSON.parse(res);
							} catch(e) {
								res = { state : 'error', response : res };
							}
						}

						// filtering response
            if (lib.util.checkFunction(options.removeDataFilter))
            {
              res = options.removeDataFilter(res, parent);
            }

						// act
						if (res && res.state && res.state === 'success')
						{
							removeElement(id);
						}
						else
						{
							alert(lib.language('error_remove_error'));
							return false;
						}
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
	 * update queue
	 *
	 * @param {Object} res
	 */
	updateProgress(res)
	{
		let $el = this.$queue.children(`li[data-id=${res.id}]`);
		let $progress = lib.util.findDOM($el, 'element', 'progress');

		// check
		if (!(res && res.data)) return;

		// get percent
		let percent = parseInt((res.data.loaded / res.data.total) * 100);
		$progress.width(`${percent}%`).find('em').text(percent);

		this.parent.eventReceiver('queue.updateProgress', {
			$selectElement : $el,
			id: res.id,
			loaded : res.data.loaded,
			total : res.data.total
		});
	};

	/**
	 * upload result
	 *
	 * @param {String} state (success|error)
	 * @param {Object} file
	 */
	uploadResult(state, file)
	{
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
	 * @return {int}
	 */
	getSize()
	{
		let size = 0;
		this.items.files.forEach((item) => {
			size += item.size;
		});
		return size;
	};

	/**
   * change id
   * 특정 id가 있는 큐를 찾아서 새로운 id로 바꿉니다.
   *
   * @param {number} id
   * @param {number} newId
   */
	changeId(id, newId)
  {
    if (newId === undefined) return;
    const { files, ids } = this.items;
    let index = this.findItem(id);
    if (index !== undefined)
    {
      let queue = this.selectQueueElement(id)[0];
      // edit id from queue element
      if (queue) queue.setAttribute('data-id', newId);
      // edit id from uploader object
      ids[index] = newId;
      files[index].id = newId;
    }
  };

}
