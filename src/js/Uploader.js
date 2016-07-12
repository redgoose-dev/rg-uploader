/**
 * Uploader component
 *
 */

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
	 * init
	 *
	 * @param {RGUploader} parent
	 */
	init(parent)
	{
		this.parent = parent;
	},

	upload()
	{
		log(this.files);
		log('run upload');

		// TODO : 몇개까지 올릴 수 있는지 검사 (올라와져있는 큐의 갯수와 합쳐야함)
		// TODO : 허용용량 체크
		// TODO : 허용하는 파일 확장자 체크

		// reset form
		// TODO : autoUpload 옵션값을 만들어서 선택하면 바로 올릴지 버튼을 눌러서 올릴지 분기가 나뉜다.
		// TODO : 이때 reset을 하는 타이밍이 변한다. 아니면 upload complete,fail 타이밍에 리셋을 하는것이 더 깔끔해 보인다.
		resetForm($(this));
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
		this.$uploadElement.on('change', self.upload);
	}
};