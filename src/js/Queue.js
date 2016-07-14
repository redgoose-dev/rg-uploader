// load modules
const util = require('./Util.js');


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
	 * @var {Array} this.ids
	 */
	this.ids = [];

	/**
	 * @var {String} this.style
	 */
	this.style = 'list';

	/**
	 * @var {Object} this.$queue
	 */
	this.$queue = util.findElement(parent.$container, 'queue').children('ul');

	/**
	 * @var {Object} this.$templete
	 */
	this.$templete = util.findElement(parent.$container, 'template');


	/**
	 * init event
	 *
	 */
	var initEvent = () => {
		var self = this;

		// change queue style
		let $selectQueueStyle = util.findElement(parent.$container, 'selectQueueStyle');
		if ($selectQueueStyle.length)
		{
			$selectQueueStyle.children('button').on('click', function(){
				if ($(this).hasClass('on')) return false;
				self.changeStyle($(this).data('style'));
			});
		}
	};

	/**
	 * change style
	 *
	 * @Param {String} styleName
	 */
	this.changeStyle = (styleName) => {
		// change style
		let $selectQueueStyle = util.findElement(parent.$container, 'selectQueueStyle');
		$selectQueueStyle.children('button').removeClass('on').filter('.style-' + styleName).addClass('on');

		this.style = styleName;
		this.$queue.removeClass().addClass('style-' + styleName);
	};

	/**
	 * add queue
	 *
	 */
	this.add = (file) => {
		this.items.ids.push(file.lastModified);
		this.items.files.push(file);
	};

	/**
	 * remove queue
	 *
	 */
	this.remove = (id) => {

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
	 * add progress queue
	 *
	 * @Param {Object} res
	 */
	this.addProgress = (items) => {
		items.forEach((item) => {
			this.add(item);

			let $tmpEl = this.$templete.children();
			let $item = $tmpEl.children('.loading').clone();

			// input meta
			$item.attr('data-id', item.lastModified);
			util.findText($item, 'filename').text(item.name);

			// reset percentage
			util.findElement($item, 'progress').width('0%').find('em').text('0');

			// append element
			this.$queue.append($item);
		});
	};

	/**
	 * updare queue
	 *
	 * @Param {Object} res
	 */
	this.updateProgress = (res) => {
		let $el = this.$queue.children('li[data-id=' + res.id + ']');
		let $progress = util.findElement($el, 'progress');
		let percent = parseInt((res.data.loaded / res.data.total) * 100);
		$progress.width(percent + '%').find('em').text(percent);
	};

	/**
	 * change progress to complete queue
	 *
	 * @Param {Object} res
	 */
	this.changeProgressToComplete = (file) => {
		let $targetEl = this.selectQueueElement(file.lastModified);
		let $el = this.$templete.children().children('.complete').clone();

		// set queue id
		$el.attr('data-id', file.lastModified);

		let $previewImages = util.findElement($el, 'previewImage');
		let $customButtons = util.findElement($el, 'customButtons');
		let $fileType = util.findText($el, 'filetype');
		let $fileName = util.findText($el, 'filename');
		let $state = util.findText($el, 'state');
		let $fileSize = util.findText($el, 'filesize');

		$fileType.text(file.type);
		$fileName.text(file.name);
		$state.text('uploaded');
		$fileSize.text(file.size);


		log(file);

		// TODO : 정보 업데이트
		// TODO : select 이벤트 걸기
		// TODO : 큐 네비게이션 버튼추가

		// append complete queue and remove progress queue
		$targetEl.after($el).remove();
	};


	this.import = (res) => {
		// TODO : 외부에서 가져온 데이터로 큐 등록하기
	};


	// init event
	initEvent();

	// set style
	this.changeStyle(this.options.style);
};