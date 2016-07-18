/**
 * Uploader component
 */

const fileUpload = require('FileUpload.js');
const util = require('./Util.js');
const lang = require('./Language.js');


// export
module.exports = function Uploader(parent) {

	/**
	 * @var {String} component name
	 */
	this.name = 'Uploader';

	/**
	 * @var {Queue} queue
	 */
	this.queue = parent.queue;

	/**
	 * @var {Object} upload elements
	 */
	this.$uploadElement = null;

	/**
	 * @var {Array} readyItems
	 */
	this.readyItems = [];

	/**
	 * @var {Boolean} uploading
	 */
	this.uploading = false;


	/**
	 * get total ready items size
	 *
	 * @Param {Array} items
	 * @Return {int}
	 */
	var getTotalReadySize = (items) => {
		var size = 0;
		for (let i=0; i<items.length; i++)
		{
			size += items[i].size;
		}
		return size;
	};

	/**
	 * merge file list
	 *
	 * @Param {Object} $el
	 * @Return {Array}
	 */
	var mergeFileList = ($el) => {
		var files = [];
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
	 * @Param {Object} el [type=file] element
	 */
	this.pushReadyUploadFiles = (files) => {
		let options = parent.options;
		let limitCount = options.queue.limit;
		let error = {
			type : false,
			extension : false,
			filesize : false
		};

		function actError(type, message)
		{
			if (error[type] == false)
			{
				alert(message);
				error[type] = true;
			}
		}

		// check file count
		if (files.length > limitCount)
		{
			alert(lang('error_upload_limit', [options.queue.limit]));
			return false;
		}

		if (options.limitSizeTotal < (getTotalReadySize(this.readyItems) + getTotalReadySize(files)))
		{
			alert(lang('error_limit_size'));
			return false;
		}

		// check items and add items ready for upload
		for (let i=0; i<files.length; i++)
		{
			if (!files[i].type)
			{
				actError('type', lang('error_file_type'));
				continue;
			};

			// check file extension
			if (options.allowFileTypes.indexOf(files[i].type.split('/')[1]) < 0)
			{
				actError('extension', lang('error_check_file'));
				continue;
			}

			// check file size
			if (files[i].size > options.limitSize)
			{
				actError('filesize', lang('error_limit_size2'));
				continue;
			}

			// set unique id
			files[i].id = util.getUniqueNumber();

			// push upload item
			this.readyItems.push(files[i]);
		}

		this.readyItems.forEach((item) => {
			parent.queue.addProgress(item);
		});
	};

	/**
	 * play upload
	 *
	 */
	var upload = () => {
		if (!this.readyItems.length) return false;

		this.uploading = true;

		if (parent.options.uploadScript)
		{
			fileUpload(
				parent.options.uploadScript,
				this.readyItems[0],
				(type, response, file) => {
					switch(type) {
						case 'progress':
							this.uploadProgress(response, file);
							break;
						case 'complete':
							this.uploadComplete(response, file);
							break;
					}
				}
			);
		}
		else
		{
			// TODO : make local upload
		}
	};

	/**
	 * upload progress event
	 *
	 * @Param {Object} res
	 * @Param {File} file
	 */
	this.uploadProgress = (res, file) => {
		parent.queue.updateProgress({
			id : file.id,
			data : res
		});
		if (parent.options.uploadProgress)
		{
			parent.options.uploadProgress(res, file);
		}
	};

	/**
	 * upload complete event
	 *
	 * @Param {Object} res
	 * @Param {File} file
	 */
	this.uploadComplete = (res, file) => {
		switch(res.state) {
			case 'success':
				file.src = res.response.src;
				file.filename = (file.name) ? res.response.filename : file.name;
				parent.queue.changeProgressToComplete(file);
				parent.updateSize(file.size);

				// callback
				if (parent.options.uploadComplete)
				{
					parent.options.uploadComplete(file);
				}
				break;
			case 'error':
				file.message = res.response.message;
				parent.queue.changeProgressToError(file);

				// callback
				if (parent.options.uploadFail)
				{
					parent.options.uploadFail(file);
				}
				break;
		}

		this.readyItems.splice(0, 1);

		// next upload
		if (this.readyItems.length)
		{
			upload();
		}
		else
		{
			this.uploading = false;
		}
	};

	/**
	 * init event
	 *
	 */
	this.initEvent = () => {
		let $el = util.findDOM(parent.$container, 'element', 'addfiles');
		let $extEl = parent.options.$externalFileForm;

		// check upload element in container
		if (!$el.length) return;

		this.$uploadElement = $el;

		// assign external upload element
		if ($extEl.length)
		{
			this.$uploadElement = this.$uploadElement.add($extEl);
		}

		// init change event
		this.$uploadElement.on('change', (e) => {
			// check auto upload

			if (parent.options.autoUpload)
			{
				if (this.uploading)
				{
					alert(lang('error_add_upload'));
					this.resetEvent();

					return false;
				}

				// play upload
				this.play();
			}
		});

		// TODO : dropzone 이벤트 만들기
	};

	/**
	 * remove event
	 */
	this.removeEvent = () => {
		this.$uploadElement.off('change').each((k, o) => {
			$(o).replaceWith( $(o).clone( true ) );
		});
	}

	/**
	 * reset event
	 */
	this.resetEvent = () => {
		this.removeEvent();
		this.initEvent();
	}

	/**
	 * play upload
	 *
	 */
	this.play = () => {
		var files = mergeFileList(this.$uploadElement);

		if (!files.length)
		{
			alert(lang('error_not_upload_file'));
			return false;
		}

		// push upload items
		this.pushReadyUploadFiles(files);

		// reset form
		this.resetEvent();

		// start upload
		upload();
	}


	// ACTION
	this.initEvent();
};