/**
 * Uploader component
 */

const fileUpload = require('FileUpload.js');
const util = require('./Util.js');
const lang = require('./Language.js');


/**
 * reset input[type=file]
 *
 * @param {Object} $el
 */
function resetForm($el)
{
	$el.each((k, o) => {
		$(o).replaceWith( $(o).clone( true ) );
	});
}


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

		parent.queue.addProgress(this.readyItems);
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
					// remove complete item
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
				break;
			case 'error':
				parent.queue.changeProgressToError(res.response.message, file);
				break;
		}

		this.readyItems.splice(0, 1);

		// play callback
		if (parent.options.uploadComplete)
		{
			parent.options.uploadComplete(file);
		}

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
		var self = this;
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
					resetForm(this.$uploadElement);
					return false;
				}

				// play upload
				this.play();
			}
		});

		// TODO : dropzone 이벤트 만들기
	};

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
		resetForm(this.$uploadElement);

		// start upload
		upload();
	}


	// ACTION
	this.initEvent();
};