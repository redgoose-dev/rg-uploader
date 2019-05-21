import $ from 'jquery';
import * as lib from './lib';

export default class Uploader {

	constructor(parent)
	{
		this.parent = parent;
		this.name = 'Uploader';
		this.queue = parent.queue;
		this.$uploadElement = null;
		this.readyItems = [];
		this.uploading = false;

		// set start upload element
		const $startUpload = lib.util.findDOM(parent.$container, 'element', 'startUpload');

		// set upload element
		this.$uploadElement = lib.util.findDOM(parent.$container, 'element', 'addFiles');
		this.addUploadElements($(parent.options.externalFileForm));

		if (!(this.$uploadElement && this.$uploadElement.length)) return;

		// init change event
		this.$uploadElement.each((k, o) => {
			$(o).on('change', () => {
				// check auto upload
				this.pushReady();

				// start upload
				if (parent.options.autoUpload)
				{
					this.start();
				}
			});
		});

		// init start upload button
		if ($startUpload && $startUpload.length)
		{
			$startUpload.on('click', () => {
				this.start();
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
	static getTotalReadySize(items)
	{
		let size = 0;
		for (let i=0; i<items.length; i++)
		{
			size += items[i].size;
		}
		return size;
	};

	/**
	 * merge file list
	 *
	 * @param {Object} $el
	 * @return {Array}
	 */
	static mergeFileList($el)
	{
		let files = [];
		$el.each((k, o) => {
			for (let i=0; i<o.files.length; i++)
			{
				files.push(o.files[i]);
			}
		});
		return files;
	};

	/**
	 * push ready upload files
	 *
	 * @param {Array} files [type=file] element
	 */
	pushReadyUploadFiles(files)
	{
		let options = this.parent.options;
		let limitCount = options.queue.limit;
		let error = {
			type : false,
			extension : false,
			filesize : false
		};
		let newReadyItems = [];

		function actError(type, message)
		{
			if (error[type] === false)
			{
				alert(message);
				error[type] = true;
			}
		}

		// check file count
		if ((this.parent.queue.items.ids.length + files.length) > limitCount)
		{
			alert(lib.language('error_upload_limit', [options.queue.limit]));
			return false;
		}

		// check total upload size
		let size = this.parent.queue.getSize() + this.constructor.getTotalReadySize(this.readyItems) + this.constructor.getTotalReadySize(files);
		if (options.limitSizeTotal < size)
		{
			alert(lib.language('error_limit_size'));
			return false;
		}

		// check items and add items ready for upload
		for (let i=0; i<files.length; i++)
		{
			// check file extension
			if (options.allowFileTypes.indexOf(files[i].name.split('.').pop()) < 0)
			{
				actError('extension', lib.language('error_check_file'));
				continue;
			}

			// check file size
			if (files[i].size > options.limitSize)
			{
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

		newReadyItems.forEach((item) => {
			this.parent.queue.addProgress(item);
		});
	};

	/**
	 * push ready queue
	 */
	pushReady()
	{
		let items = this.constructor.mergeFileList(this.$uploadElement);

		// check items
		if (!items.length)
		{
			alert(lib.language('error_not_upload_file'));
			return false;
		}

		// push upload items
		this.pushReadyUploadFiles(items);

		// reset form
		this.resetEvent(this.$uploadElement);
	};

	/**
	 * start upload
	 *
	 * @param {Array} files
	 */
	start(files=[])
	{
		// push parameter files
		if (files && files.length)
		{
			this.pushReadyUploadFiles(files);
		}

		if (this.uploading)
		{
			alert(lib.language('error_now_uploading'));
		}
		else
		{
			this.play();
		}
	};

	/**
	 * play upload
	 */
	play()
	{
		const { options } = this.parent;

		if (!this.readyItems.length) return;

		this.uploading = true;

		// change ready to loading
		let $el = this.parent.queue.selectQueueElement(this.readyItems[0].id);
		$el.removeClass('ready');
		lib.util.findDOM($el, 'text', 'state').text('loading...');
		lib.util.findDOM($el, 'element', 'removeQueue').remove();

		// act upload
		let userParams = (lib.util.checkFunction(options.uploadParamsFilter)) && options.uploadParamsFilter(this.readyItems[0], this.parent);

		let upload = lib.fileUpload(
			lib.util.getFunctionReturn(options.uploadScriptFunc, options.uploadScript),
			this.readyItems[0],
			userParams,
			options.uploadHeaders,
      (src) => {
        return (lib.util.checkFunction(options.uploadDataFilter)) ? options.uploadDataFilter(src, this.parent) : src;
      },
		);

		// callback upload event
		upload
			.done((res, file) => {
				this.uploadComplete('success', res, file);
			})
			.progress((res, file) => {
				this.uploadProgress(res, file);
			})
			.fail((message, file) => {
				this.uploadComplete('error', message, file);
			});
	};

	/**
	 * upload progress event
	 *
	 * @param {Object} res
	 * @param {File} file
	 */
	uploadProgress(res, file)
	{
		this.parent.queue.updateProgress({
			id : file.id,
			data : res
		});
		if (this.parent.options.uploadProgress)
		{
			this.parent.options.uploadProgress(res, file, this.parent);
		}
	};

	/**
	 * upload complete event
	 *
	 * @param {String} state (success|error)
	 * @param {Object} res
	 * @param {Object} file
	 */
	uploadComplete(state, res, file)
	{
		switch(state)
		{
			case 'success':
				file = $.extend({}, file, res);
				delete file.slice;
				this.parent.queue.uploadResult('success', file);

				// callback
				if (this.parent.options.uploadComplete)
				{
					this.parent.options.uploadComplete(file, this.parent);
				}
				break;

			case 'error':
				file.message = res;
				this.parent.queue.uploadResult('error', file);
				console.error('ERROR:', file.message);

				// callback
				if (lib.util.checkFunction(this.parent.options.uploadFail))
				{
					this.parent.options.uploadFail(file, this.parent);
				}
				break;
		}

		this.readyItems.splice(0, 1);

		// next upload
		if (this.readyItems.length)
		{
			this.play();
		}
		else
		{
			this.uploading = false;

			if (this.parent.options.uploadCompleteAll && typeof this.parent.options.uploadCompleteAll === 'function')
			{
				this.parent.options.uploadCompleteAll(this.parent);
			}

			// send event to plugin
			this.parent.eventReceiver('queue.uploadCompleteAll');
		}
	};

	/**
	 * add upload elements
	 *
	 * @param {Object} $el
	 */
	addUploadElements($el)
	{
		if (this.$uploadElement && this.$uploadElement.length)
		{
			this.$uploadElement = this.$uploadElement.add($el);
		}
		else
		{
			this.$uploadElement = $el;
		}
	};

	/**
	 * reset event
	 *
	 * @param {Object} $el
	 */
	resetEvent($el)
	{
		let $inputs = $el || this.$uploadElement;
		$inputs.each((k, o) => {
			lib.util.inputFileReset(o);
		});
	};

}
