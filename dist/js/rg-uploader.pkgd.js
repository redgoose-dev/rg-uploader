/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\n// load modules\nvar Redux = __webpack_require__(1);\n\n/**\n * class RGUploader\n *\n * @param {Object} options\n */\nwindow.RGUploader = function (options) {\n\tvar _this = this;\n\n\t// set self\n\tvar self = this;\n\n\t// set uploader component\n\tvar uploader = __webpack_require__(2);\n\tuploader.init(this);\n\n\t// set queue component\n\tvar queue = __webpack_require__(3);\n\tqueue.init(this);\n\n\t// set plugin component\n\tvar plugin = __webpack_require__(4);\n\t//plugin.init(this);\n\n\t// set options\n\tthis.options = $.extend({}, this.defaultOptions, options);\n\n\t// set api\n\tthis.api = __webpack_require__(5);\n\t//this.api.init(this);\n\n\t/**\n  * init event\n  *\n  */\n\tvar initEvent = function initEvent() {\n\n\t\t// init upload event\n\t\tuploader.initEvent();\n\t};\n\n\t/**\n  * appState(redux)\n  *\n  * @param {Object} state\n  * @param {Object} action\n  * @return {Object}\n  */\n\tthis.appState = function (state, action) {\n\t\tif (typeof state === 'undefined') return _this.defaultState;\n\n\t\tswitch (action.type) {\n\t\t\tcase 'UPLOAD':\n\t\t\t\tlog('ACT UPLOAD');\n\t\t\t\tlog(state);\n\t\t\t\tbreak;\n\t\t}\n\n\t\treturn state;\n\t};\n\n\t/**\n  * render component\n  * 상태가 변경되면 적용하는 오더를 내린다.\n  *\n  */\n\tthis.render = function () {\n\t\tvar state = _this.store.getState();\n\t};\n\n\t// action\n\tif (this.options.$container.length) {\n\t\t// set container element\n\t\tthis.$container = this.options.$container;\n\n\t\t// run initEvent()\n\t\tinitEvent();\n\t}\n};\n\n/*****************************\n * M E T H O D\n *****************************/\n\n/**\n * default options\n *\n */\nRGUploader.prototype.defaultOptions = {\n\tuploadScript: null,\n\t$container: $('.rg-uploader'),\n\t$externalFileForm: null\n};\n\n/**\n * default state\n *\n */\nRGUploader.prototype.defaultState = {\n\tqueue: {\n\t\titems: []\n\t}\n};\n\n/**\n * init\n *\n */\nRGUploader.prototype.init = function () {\n\n\tif (!this.options.$container.length) return false;\n\n\t// set store\n\tthis.store = Redux.createStore(this.appState);\n\n\t// act render\n\tthis.render();\n\n\t// subscribe store\n\tthis.store.subscribe(this.render);\n};\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/js/rg-Uploader.js\n ** module id = 0\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/js/rg-Uploader.js?");

/***/ },
/* 1 */
/***/ function(module, exports) {

	eval("module.exports = Redux;\n\n/*****************\n ** WEBPACK FOOTER\n ** external \"Redux\"\n ** module id = 1\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///external_%22Redux%22?");

/***/ },
/* 2 */
/***/ function(module, exports) {

	eval("'use strict';\n\n/**\n * Uploader component\n *\n */\n\n/**\n * reset input[type=file]\n *\n * @param {Object} $el\n */\nfunction resetForm($el) {\n\t$el.replaceWith($el.clone(true));\n}\n\n// export\nmodule.exports = {\n\n\t/**\n  * @var {String} component name\n  */\n\tname: 'Uploader',\n\n\t/**\n  * @var {RGUploader} parent\n  */\n\tparent: null,\n\n\t/**\n  * @var {Object} upload elements\n  */\n\t$uploadElement: null,\n\n\t/**\n  * init\n  *\n  * @param {RGUploader} parent\n  */\n\tinit: function init(parent) {\n\t\tthis.parent = parent;\n\t},\n\tupload: function upload() {\n\t\tlog(this.files);\n\t\tlog('run upload');\n\n\t\t// TODO : 몇개까지 올릴 수 있는지 검사 (올라와져있는 큐의 갯수와 합쳐야함)\n\t\t// TODO : 허용용량 체크\n\t\t// TODO : 허용하는 파일 확장자 체크\n\n\t\t// reset form\n\t\t// TODO : autoUpload 옵션값을 만들어서 선택하면 바로 올릴지 버튼을 눌러서 올릴지 분기가 나뉜다.\n\t\t// TODO : 이때 reset을 하는 타이밍이 변한다. 아니면 upload complete,fail 타이밍에 리셋을 하는것이 더 깔끔해 보인다.\n\t\tresetForm($(this));\n\t},\n\n\n\t/**\n  * init event\n  *\n  */\n\tinitEvent: function initEvent() {\n\t\tvar self = this;\n\t\tvar $el = this.parent.$container.find('[data-element=addfiles]');\n\t\tvar $extEl = this.parent.options.$externalFileForm;\n\n\t\t// check upload element in container\n\t\tif (!$el.length) return;\n\n\t\tthis.$uploadElement = $el;\n\n\t\t// assign external upload element\n\t\tif ($extEl.length) {\n\t\t\tthis.$uploadElement = this.$uploadElement.add($extEl);\n\t\t}\n\n\t\t// init change event\n\t\tthis.$uploadElement.on('change', self.upload);\n\t}\n};\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/js/Uploader.js\n ** module id = 2\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/js/Uploader.js?");

/***/ },
/* 3 */
/***/ function(module, exports) {

	eval("'use strict';\n\n// export\nmodule.exports = {\n\n\t/**\n  * @var {String} component name\n  */\n\tname: 'Queue',\n\n\t/**\n  * @var {RGUploader} parent\n  */\n\tparent: null,\n\n\t/**\n  * init\n  *\n  * @param {RGUploader} parent\n  */\n\tinit: function init(parent) {\n\t\tthis.parent = parent;\n\t}\n};\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/js/Queue.js\n ** module id = 3\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/js/Queue.js?");

/***/ },
/* 4 */
/***/ function(module, exports) {

	eval("\"use strict\";\n\nmodule.exports = null;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/js/Plugins.js\n ** module id = 4\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/js/Plugins.js?");

/***/ },
/* 5 */
/***/ function(module, exports) {

	eval("\"use strict\";\n\nmodule.exports = null;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/js/API.js\n ** module id = 5\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/js/API.js?");

/***/ }
/******/ ]);