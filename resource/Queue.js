'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _lib = require('./lib');

var lib = _interopRequireWildcard(_lib);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Queue = function () {
	function Queue(parent) {
		_classCallCheck(this, Queue);

		this.name = 'Queue';
		this.parent = parent;
		this.options = parent.options.queue;
		this.items = { ids: [], files: [] };
		this.style = 'list';
		this.$queue = lib.util.findDOM(parent.$container, 'element', 'queue').children('ul');
		this.keyboardEvent = new lib.keyboardEvent(parent.options.eventPrefixName, [{ key: 'ctrl', code: 17 }, { key: 'cmd', code: 91 }]);
	}

	/**
  * init
  */


	_createClass(Queue, [{
		key: 'init',
		value: function init() {
			// set queue height
			if (this.options.height) {
				lib.util.findDOM(this.parent.$container, 'comp', 'queue').height(this.options.height);
			}

			// set style
			this.changeStyle(this.options.style);

			// import queue datas
			if (this.options.datas) {
				this.import(this.options.datas);
			}
		}

		/**
   * init select queue event
   *
   * @param {Object} $el
   */

	}, {
		key: 'initSelectQueueEvent',
		value: function initSelectQueueEvent($el) {
			var _this = this;

			// select queue event
			$el.on('click', function (e) {
				return _this.selectQueue((0, _jquery2.default)(e.currentTarget).data('id'));
			});
		}

		/**
   * create navigation buttons
   *
   * @param {Object} options
   * @param {Object} file
   */

	}, {
		key: 'createNavigationButtons',
		value: function createNavigationButtons(options, file) {
			var _this2 = this;

			if (!options || !options.length) return;

			var $buttons = [];
			options.forEach(function (item) {
				if (!item.name || !item.iconName || !item.action) return;
				if (item.show && item.show(file) === false) return;

				var className = item.className ? 'class="' + item.className + '"' : '';
				var $item = (0, _jquery2.default)('<button type="button" title="' + item.name + '" ' + className + '>' + ('<i class="material-icons">' + item.iconName + '</i>') + '</button>');

				$item.on('click', function (e) {
					item.action(_this2.parent, file);
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

	}, {
		key: 'findItem',
		value: function findItem(id) {
			return this.items.ids.indexOf(Number(id));
		}

		/**
   * change style
   *
   * @param {String} styleName
   */

	}, {
		key: 'changeStyle',
		value: function changeStyle(styleName) {
			this.style = styleName;
			this.$queue.removeClass().addClass('style-' + styleName);

			// send event to plugin
			this.parent.eventReceiver('queue.changeStyle', { style: styleName });
		}

		/**
   * import
   *
   * @param {Array|String} src
   */

	}, {
		key: 'import',
		value: function _import(src) {
			var _this3 = this;

			if (!src) return;

			if (typeof src === 'string') {
				_jquery2.default.get(src, function (res) {
					if (typeof res === 'string') {
						try {
							res = JSON.parse(res);
						} catch (e) {
							res = [];
						}
					}
					if (!(res && res.length)) {
						alert(lib.language('error_import'));
						return;
					}
					res.forEach(function (item) {
						_this3.addComplete(item);
					});
				});
			} else if (src instanceof Array) {
				src.forEach(function (item) {
					_this3.addComplete(item);
				});
			}
		}

		/**
   * delete queue
   *
   * @param {Array} ids
   */

	}, {
		key: 'delete',
		value: function _delete(ids) {
			var _this4 = this;

			if (!ids || !ids.length) return;

			ids.forEach(function (id) {
				_this4.removeQueue(id, false, true);
			});
		}

		/**
   * select queue
   *
   * @param {number} id
   */

	}, {
		key: 'selectQueue',
		value: function selectQueue(id) {
			var selectedClassName = 'selected';
			var $queues = this.$queue.children();

			if (id) {
				var $el = this.selectQueueElement(id);

				if (this.keyboardEvent.isPressKeyCode) {
					$el.toggleClass(selectedClassName);
				} else {
					var isSelected = $el.hasClass(selectedClassName);
					var selectCount = $queues.filter('.' + selectedClassName).length;

					$queues.removeClass(selectedClassName);

					if (!isSelected || selectCount > 1) {
						$el.addClass(selectedClassName);
					}
				}
			} else {
				if ($queues.filter('.' + selectedClassName).length > 0) {
					$queues.removeClass(selectedClassName);
				} else {
					$queues.addClass(selectedClassName);
				}
			}

			// send event to plugin
			this.parent.eventReceiver('queue.selectQueue', {
				$selectElements: this.$queue.children('.' + selectedClassName),
				$selectElement: id ? this.selectQueueElement(id) : $queues.eq(0)
			});
		}

		/**
   * select queue element
   *
   * @param {String|Number} id
   * @return {Object}
   */

	}, {
		key: 'selectQueueElement',
		value: function selectQueueElement() {
			var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			return this.$queue.children('li[data-id=' + id + ']');
		}

		/**
   * add queue
   */

	}, {
		key: 'add',
		value: function add(file) {
			// set file values
			file.fullSrc = this.parent.options.srcPrefixName + file.src;

			this.items.ids.push(Number(file.id));
			this.items.files.push(file);
		}

		/**
   * remove queue
   */

	}, {
		key: 'remove',
		value: function remove(id) {
			var n = this.findItem(id);
			this.items.ids.splice(n, 1);
			this.items.files.splice(n, 1);
		}

		/**
   * add progress queue
   *
   * @param {Object} file
   */

	}, {
		key: 'addProgress',
		value: function addProgress(file) {
			var _this5 = this;

			var $item = (0, _jquery2.default)(lib.template.loading);
			var $removeButton = lib.util.findDOM($item, 'element', 'removeQueue').children('button');

			// add item in queue index
			this.add(file);

			// input meta
			$item.attr('data-id', file.id);
			lib.util.findDOM($item, 'text', 'filename').text(file.name);

			// reset percentage
			lib.util.findDOM($item, 'element', 'progress').width('0%').find('em').text('0');

			// init remove queue event
			$removeButton.on('click', function (e) {
				var id = parseInt((0, _jquery2.default)(e.currentTarget).closest('li').data('id'));
				_this5.removeQueue(id, true, false);
				_this5.parent.uploader.readyItems.forEach(function (item, n) {
					if (item.id === id) {
						_this5.parent.uploader.readyItems.splice(n, 1);
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

	}, {
		key: 'addComplete',
		value: function addComplete(file) {
			var $beforeElement = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			var id = file.id;
			var $el = (0, _jquery2.default)(lib.template.complete);

			// set elements in queue
			var $previewImages = lib.util.findDOM($el, 'element', 'previewImage');
			var $customButtons = lib.util.findDOM($el, 'element', 'customButtons');
			var $fileType = lib.util.findDOM($el, 'text', 'filetype');
			var $fileName = lib.util.findDOM($el, 'text', 'filename');
			var $state = lib.util.findDOM($el, 'text', 'state');
			var $fileSize = lib.util.findDOM($el, 'text', 'filesize');

			// add queue index
			this.add(file);

			// set queue id
			$el.attr('data-id', id);

			// insert queue data
			$fileType.text(file.type);
			$fileName.text(file.name);
			$state.text('uploaded');
			$fileSize.text(file.size ? lib.util.bytesToSize(file.size) : 'none');
			$customButtons.html('');

			// check image and assign preview background
			if (file.type.split('/')[0] === 'image') {
				$previewImages.css('background-image', 'url(' + file.fullSrc + ')');
			}

			// set toggle select event
			this.initSelectQueueEvent($el);

			// create queue navigation buttons
			var $buttons = this.createNavigationButtons(this.options.buttons, file);
			if ($buttons.length) {
				$customButtons.append($buttons);
			}

			// append queue
			if ($beforeElement && $beforeElement.length) {
				$beforeElement.after($el);
			} else {
				this.$queue.append($el);
			}

			// send event to plugin
			this.parent.eventReceiver('queue.uploadComplete', {
				$selectElement: $el,
				id: id,
				file: file
			});
		}

		/**
   * add error queue
   *
   * @param {Object} file
   * @param {Object} $beforeElement
   */

	}, {
		key: 'addError',
		value: function addError(file, $beforeElement) {
			var _this6 = this;

			var id = file.id;
			var $el = (0, _jquery2.default)(lib.template.error);

			var $fileType = lib.util.findDOM($el, 'text', 'filetype');
			var $fileName = lib.util.findDOM($el, 'text', 'filename');
			var $state = lib.util.findDOM($el, 'text', 'state');

			// add queue index
			this.add(file);

			// set queue id
			$el.attr('data-id', id);

			$fileType.text(file.type);
			$fileName.text(file.name);
			$state.text(file.message);

			// append error queue
			if ($beforeElement && $beforeElement.length) {
				$beforeElement.after($el);
			} else {
				this.$queue.append($el);
			}

			setTimeout(function () {
				_this6.removeQueue(id, false, false);
			}, 3000);
		}

		/**
   * remove queue
   *
   * @param {Number} id
   * @param {Boolean} isLoadingQueue
   * @param {Boolean} useScript
   */

	}, {
		key: 'removeQueue',
		value: function removeQueue(id, isLoadingQueue) {
			var _this7 = this;

			var useScript = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

			var self = this;
			function removeElement(id) {
				self.selectQueueElement(id).fadeOut(400, function () {
					(0, _jquery2.default)(this).remove();
					self.remove(id);
					self.parent.eventReceiver('queue.removeQueue', {});
				});
			}

			if (isLoadingQueue) {
				this.selectQueueElement(id).filter('.loading').remove();

				// send event to plugin
				this.parent.eventReceiver('queue.removeQueue', {});
			} else {
				var file = this.items.files[this.findItem(id)];

				if (file < 0) {
					console.error('Not found queue id');
					return false;
				}

				if (useScript && this.parent.options.removeScript && !file.isLocalFile) {
					// remove parameters filter
					file = lib.util.getFunctionReturn(this.parent.options.removeParamsFilter, file);

					// play remove file script
					_jquery2.default.post(this.parent.options.removeScript, file, function (res, state) {
						if (typeof res === 'string') {
							try {
								res = JSON.parse(res);
							} catch (e) {
								res = { state: 'error', response: res };
							}
						}

						// filtering response
						res = lib.util.getFunctionReturn(_this7.parent.options.removeDataFilter, res);

						// act
						if (res && res.state && res.state === 'success') {
							removeElement(id);
						} else {
							alert(lib.language('error_remove_error'));
							return false;
						}
					});
				} else {
					removeElement(id);
				}
			}
		}
	}, {
		key: 'updateProgress',


		/**
   * update queue
   *
   * @param {Object} res
   */
		value: function updateProgress(res) {
			var $el = this.$queue.children('li[data-id=' + res.id + ']');
			var $progress = lib.util.findDOM($el, 'element', 'progress');

			// check
			if (!(res && res.data)) return;

			// get percent
			var percent = parseInt(res.data.loaded / res.data.total * 100);
			$progress.width(percent + '%').find('em').text(percent);

			this.parent.eventReceiver('queue.updateProgress', {
				$selectElement: $el,
				id: res.id,
				loaded: res.data.loaded,
				total: res.data.total
			});
		}
	}, {
		key: 'uploadResult',


		/**
   * upload result
   *
   * @param {String} state (success|error)
   * @param {Object} file
   */
		value: function uploadResult(state, file) {
			if (!state) return false;
			var $loading = this.selectQueueElement(file.id);
			this.remove(file.id);
			switch (state) {
				case 'success':
					this.addComplete(file, $loading);
					break;
				case 'error':
					this.addError(file, $loading);
					break;
			}
			this.removeQueue(file.id, true);
		}
	}, {
		key: 'getSize',


		/**
   * get files size (total)
   *
   * @return {int}
   */
		value: function getSize() {
			var size = 0;
			this.items.files.forEach(function (item) {
				size += item.size;
			});
			return size;
		}
	}]);

	return Queue;
}();

exports.default = Queue;