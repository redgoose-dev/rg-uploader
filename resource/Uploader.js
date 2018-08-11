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

var Uploader = function () {
	function Uploader(parent) {
		var _this = this;

		_classCallCheck(this, Uploader);

		this.parent = parent;
		this.name = 'Uploader';
		this.queue = parent.queue;
		this.$uploadElement = null;
		this.readyItems = [];
		this.uploading = false;

		// set start upload element
		var $startUpload = lib.util.findDOM(parent.$container, 'element', 'startUpload');

		// set upload element
		this.$uploadElement = lib.util.findDOM(parent.$container, 'element', 'addFiles');
		this.addUploadElements((0, _jquery2.default)(parent.options.externalFileForm));

		if (!(this.$uploadElement && this.$uploadElement.length)) return;

		// init change event
		this.$uploadElement.each(function (k, o) {
			(0, _jquery2.default)(o).on('change', function () {
				// check auto upload
				_this.pushReady();

				// start upload
				if (parent.options.autoUpload) {
					_this.start();
				}
			});
		});

		// init start upload button
		if ($startUpload && $startUpload.length) {
			$startUpload.on('click', function () {
				_this.start();
				return false;
			});
		}
	}

	/**
  * get total ready items size
  *
  * @param {Array} items
  * @return {int}
  */


	_createClass(Uploader, [{
		key: 'pushReadyUploadFiles',


		/**
   * push ready upload files
   *
   * @param {Array} files [type=file] element
   */
		value: function pushReadyUploadFiles(files) {
			var _this2 = this;

			var options = this.parent.options;
			var limitCount = options.queue.limit;
			var error = {
				type: false,
				extension: false,
				filesize: false
			};
			var newReadyItems = [];

			function actError(type, message) {
				if (error[type] === false) {
					alert(message);
					error[type] = true;
				}
			}

			// check file count
			if (this.parent.queue.items.ids.length + files.length > limitCount) {
				alert(lib.language('error_upload_limit', [options.queue.limit]));
				return false;
			}

			// check total upload size
			var size = this.parent.queue.getSize() + this.constructor.getTotalReadySize(this.readyItems) + this.constructor.getTotalReadySize(files);
			if (options.limitSizeTotal < size) {
				alert(lib.language('error_limit_size'));
				return false;
			}

			// check items and add items ready for upload
			for (var i = 0; i < files.length; i++) {
				if (!files[i].type) {
					actError('type', lib.language('error_file_type'));
					continue;
				}

				// check file extension
				if (options.allowFileTypes.indexOf(files[i].type.split('/')[1]) < 0) {
					actError('extension', lib.language('error_check_file'));
					continue;
				}

				// check file size
				if (files[i].size > options.limitSize) {
					actError('filesize', lib.language('error_limit_size2'));
					continue;
				}

				// set unique id
				files[i].id = lib.util.getUniqueNumber();

				// push upload item
				this.readyItems.push(files[i]);

				// push new ready items
				newReadyItems.push(files[i]);
			}

			newReadyItems.forEach(function (item) {
				_this2.parent.queue.addProgress(item);
			});
		}
	}, {
		key: 'pushReady',


		/**
   * push ready queue
   */
		value: function pushReady() {
			var items = this.constructor.mergeFileList(this.$uploadElement);

			// check items
			if (!items.length) {
				alert(lib.language('error_not_upload_file'));
				return false;
			}

			// push upload items
			this.pushReadyUploadFiles(items);

			// reset form
			this.resetEvent(this.$uploadElement);
		}
	}, {
		key: 'start',


		/**
   * start upload
   *
   * @param {Array} files
   */
		value: function start() {
			var files = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

			// push parameter files
			if (files && files.length) {
				this.pushReadyUploadFiles(files);
			}

			if (this.uploading) {
				alert(lib.language('error_now_uploading'));
			} else {
				this.play();
			}
		}
	}, {
		key: 'play',


		/**
   * play upload
   */
		value: function play() {
			var _this3 = this;

			if (!this.readyItems.length) return;

			this.uploading = true;

			// change ready to loading
			var $el = this.parent.queue.selectQueueElement(this.readyItems[0].id);
			$el.removeClass('ready');
			lib.util.findDOM($el, 'text', 'state').text('loading...');
			lib.util.findDOM($el, 'element', 'removeQueue').remove();

			// act upload
			var script = this.parent.options.uploadScript || null;
			var userParams = this.parent.options.uploadParamsFilter && typeof this.parent.options.uploadParamsFilter === 'function' && this.parent.options.uploadParamsFilter(this.readyItems[0]);

			var upload = lib.fileUpload(script, this.readyItems[0], userParams, this.parent.options.uploadHeaders, this.parent.options.uploadDataFilter);

			// callback upload event
			upload.done(function (res, file) {
				_this3.uploadComplete('success', res, file);
			}).progress(function (res, file) {
				_this3.uploadProgress(res, file);
			}).fail(function (message, file) {
				_this3.uploadComplete('error', message, file);
			});
		}
	}, {
		key: 'uploadProgress',


		/**
   * upload progress event
   *
   * @param {Object} res
   * @param {File} file
   */
		value: function uploadProgress(res, file) {
			this.parent.queue.updateProgress({
				id: file.id,
				data: res
			});
			if (this.parent.options.uploadProgress) {
				this.parent.options.uploadProgress(res, file);
			}
		}
	}, {
		key: 'uploadComplete',


		/**
   * upload complete event
   *
   * @param {String} state (success|error)
   * @param {Object} res
   * @param {Object} file
   */
		value: function uploadComplete(state, res, file) {
			switch (state) {
				case 'success':
					file = _jquery2.default.extend({}, file, res);
					delete file.slice;
					this.parent.queue.uploadResult('success', file);

					// callback
					if (this.parent.options.uploadComplete) {
						this.parent.options.uploadComplete(file);
					}
					break;

				case 'error':
					file.message = res;
					this.parent.queue.uploadResult('error', file);
					console.error('ERROR:', file.message);

					// callback
					if (this.parent.options.uploadFail) {
						this.parent.options.uploadFail(file);
					}
					break;
			}

			this.readyItems.splice(0, 1);

			// next upload
			if (this.readyItems.length) {
				this.play();
			} else {
				this.uploading = false;

				if (this.parent.options.uploadCompleteAll && typeof this.parent.options.uploadCompleteAll === 'function') {
					this.parent.options.uploadCompleteAll(this.parent);
				}

				// send event to plugin
				this.parent.eventReceiver('queue.uploadCompleteAll');
			}
		}
	}, {
		key: 'addUploadElements',


		/**
   * add upload elements
   *
   * @param {Object} $el
   */
		value: function addUploadElements($el) {
			if (this.$uploadElement && this.$uploadElement.length) {
				this.$uploadElement = this.$uploadElement.add($el);
			} else {
				this.$uploadElement = $el;
			}
		}
	}, {
		key: 'resetEvent',


		/**
   * reset event
   *
   * @param {Object} $el
   */
		value: function resetEvent($el) {
			var $inputs = $el || this.$uploadElement;
			$inputs.each(function (k, o) {
				lib.util.inputFileReset(o);
			});
		}
	}], [{
		key: 'getTotalReadySize',
		value: function getTotalReadySize(items) {
			var size = 0;
			for (var i = 0; i < items.length; i++) {
				size += items[i].size;
			}
			return size;
		}
	}, {
		key: 'mergeFileList',


		/**
   * merge file list
   *
   * @param {Object} $el
   * @return {Array}
   */
		value: function mergeFileList($el) {
			var files = [];
			$el.each(function (k, o) {
				for (var i = 0; i < o.files.length; i++) {
					files.push(o.files[i]);
				}
			});
			return files;
		}
	}]);

	return Uploader;
}();

exports.default = Uploader;