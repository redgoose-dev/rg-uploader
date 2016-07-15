/**
 * Uploader component
 */

const fileUpload = require('FileUpload.js');
const util = require('./Util.js');


/**
 * reset input[type=file]
 *
 * @param {Object} $el
 */
function resetForm($el)
{
	$el.replaceWith( $el.clone( true ) );
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
	 * push ready upload files
	 *
	 * @Param {Object} el [type=file] element
	 */
	this.pushReadyUploadFiles = (el) => {
		let files = el.files;
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
			alert('파일은 총 ' + options.queue.limit + '개까지 업로드할 수 있습니다.');
			return false;
		}

		if (options.limitSizeTotal < (getTotalReadySize(this.readyItems) + getTotalReadySize(files)))
		{
			alert('업로드할 수 있는 용량이 초과되었습니다.');
			return false;
		}

		// check items and add items ready for upload
		for (let i=0; i<files.length; i++)
		{
			if (!files[i].type)
			{
				actError('type', '잘못된 형식의 파일입니다.');
				continue;
			};

			// check file extension
			if (options.allowFileTypes.indexOf(files[i].type.split('/')[1]) < 0)
			{
				actError('extension', '허용되지 않는 파일은 제외됩니다.');
				continue;
			}

			// check file size
			if (files[i].size > options.limitSize)
			{
				actError('filesize', '허용하는 용량을 초과한 파일은 제외됩니다.');
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
	this.playUpload = () => {
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
			this.playUpload();
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
		let $el = parent.$container.find('[data-element=addfiles]');
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
				// push upload items
				self.pushReadyUploadFiles(e.currentTarget);

				// reset form
				resetForm($(e.currentTarget));

				// start upload
				if (!this.uploading)
				{
					self.playUpload();
				}
			}
		});
	};

	this.initEvent();
};