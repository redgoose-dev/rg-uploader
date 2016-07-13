/**
 * Uploader component
 */

const fileUpload = require('FileUpload.js');


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
module.exports = {

	/**
	 * @var {String} component name
	 */
	name : 'Uploader',

	/**
	 * @var {RGUploader} parent
	 */
	parent : null,

	/**
	 * @var {Object} upload elements
	 */
	$uploadElement : null,

	/**
	 * @var {Array} ready upload items
	 */
	readyItems : [],

	/**
	 * @var {Boolean} for check uploading
	 */
	uploading : false,

	/**
	 * init
	 *
	 * @param {RGUploader} parent
	 */
	init(parent)
	{
		this.parent = parent;
	},

	/**
	 * push ready upload files
	 *
	 * @param {Object} el [type=file] element
	 */
	pushReadyUploadFiles(el)
	{
		let files = el.files;
		let options = this.parent.options;
		let limitCount = options.queue.limit;

		// check file count
		if (files.length > limitCount)
		{
			alert('파일은 총 ' + options.queue.limit + '개까지 업로드할 수 있습니다.');
			return false;
		}

		// Add items ready for upload
		for (let i=0; i<files.length; i++)
		{
			if (!files[i].type) continue;

			// check file size
			if (files[i].size > options.limitSize) continue;

			// check file extension
			if (options.allowFileTypes.indexOf(files[i].type.split('/')[1]) < 0) continue;

			// push upload item
			this.readyItems.push(files[i]);
		}
	},

	/**
	 * play upload
	 *
	 */
	playUpload()
	{
		if (!this.readyItems.length) return false;

		// TODO : 빈 queue를 우선 등록해야함. (progress)

		if (this.parent.options.uploadScript)
		{
			fileUpload(
				this.parent.options.uploadScript,
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

		// remove complete item
		this.readyItems.splice(0, 1);
	},

	/**
	 * upload progress event
	 *
	 * @Param {Object} res
	 * @Param {File} file
	 */
	uploadProgress(res, file)
	{
		// TODO : render 실행
		log(res);
	},

	/**
	 * upload complete event
	 *
	 * @Param {Object} res
	 * @Param {File} file
	 */
	uploadComplete(res, file)
	{
		switch(res.state) {
			case 'success':
				log(res.result);
				break;
			case 'error':
				log(res.message);
				break;
		}

		// start upload
		this.playUpload();
	},

	/**
	 * init event
	 *
	 */
	initEvent()
	{
		var self = this;
		let $el = this.parent.$container.find('[data-element=addfiles]');
		let $extEl = this.parent.options.$externalFileForm;

		// check upload element in container
		if (!$el.length) return;

		this.$uploadElement = $el;

		// assign external upload element
		if ($extEl.length)
		{
			this.$uploadElement = this.$uploadElement.add($extEl);
		}

		// init change event
		this.$uploadElement.on('change', function(){
			// check auto upload
			if (self.parent.options.autoUpload)
			{
				// push upload items
				self.pushReadyUploadFiles(this);

				// reset form
				resetForm($(this));

				// start upload
				if (!self.uploading)
				{
					self.playUpload();
				}
			}
		});
	}
};