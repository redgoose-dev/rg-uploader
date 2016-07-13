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

	eval("'use strict';\n\n// load modules\nvar Redux = __webpack_require__(1);\n\n/**\n * class RGUploader\n *\n * @param {Object} options\n */\nwindow.RGUploader = function (options) {\n\tvar _this = this;\n\n\t// set self\n\tvar self = this;\n\n\t// set uploader component\n\tvar uploader = __webpack_require__(2);\n\tuploader.init(this);\n\n\t// set queue component\n\tvar queue = __webpack_require__(4);\n\tqueue.init(this);\n\n\t// set plugin component\n\tvar plugin = __webpack_require__(5);\n\t//plugin.init(this);\n\n\t// set api\n\tthis.api = __webpack_require__(6);\n\t//this.api.init(this);\n\n\t// set options\n\tthis.options = $.extend({}, this.defaultOptions, options);\n\n\t/**\n  * init event\n  *\n  */\n\tvar initEvent = function initEvent() {\n\n\t\t// init upload event\n\t\tuploader.initEvent();\n\t};\n\n\t/**\n  * appState(redux)\n  *\n  * @param {Object} state\n  * @param {Object} action\n  * @return {Object}\n  */\n\tthis.appState = function (state, action) {\n\t\tif (typeof state === 'undefined') return _this.defaultState;\n\n\t\tswitch (action.type) {\n\t\t\tcase 'UPLOAD':\n\t\t\t\tlog('ACT UPLOAD');\n\t\t\t\tlog(state);\n\t\t\t\tbreak;\n\t\t}\n\n\t\treturn state;\n\t};\n\n\t/**\n  * render component\n  * 상태가 변경되면 적용하는 오더를 내린다.\n  *\n  */\n\tthis.render = function () {\n\t\tvar state = _this.store.getState();\n\t};\n\n\t// action\n\tif (this.options.$container.length) {\n\t\t// set container element\n\t\tthis.$container = this.options.$container;\n\n\t\t// run initEvent()\n\t\tinitEvent();\n\t}\n};\n\n/*****************************\n * M E T H O D\n *****************************/\n\n/**\n * default options\n *\n */\nRGUploader.prototype.defaultOptions = {\n\tuploadScript: null,\n\t$container: $('.rg-uploader'),\n\t$externalFileForm: null\n};\n\n/**\n * default state\n *\n */\nRGUploader.prototype.defaultState = {\n\tqueue: {\n\t\titems: []\n\t}\n};\n\n/**\n * init\n *\n */\nRGUploader.prototype.init = function () {\n\n\tif (!this.options.$container.length) return false;\n\n\t// set store\n\tthis.store = Redux.createStore(this.appState);\n\n\t// act render\n\tthis.render();\n\n\t// subscribe store\n\tthis.store.subscribe(this.render);\n};\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/js/rg-Uploader.js\n ** module id = 0\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/js/rg-Uploader.js?");

/***/ },
/* 1 */
/***/ function(module, exports) {

	eval("module.exports = Redux;\n\n/*****************\n ** WEBPACK FOOTER\n ** external \"Redux\"\n ** module id = 1\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///external_%22Redux%22?");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\n/**\n * Uploader component\n */\n\nvar fileUpload = __webpack_require__(3);\n\n/**\n * reset input[type=file]\n *\n * @param {Object} $el\n */\nfunction resetForm($el) {\n\t$el.replaceWith($el.clone(true));\n}\n\n// export\nmodule.exports = {\n\n\t/**\n  * @var {String} component name\n  */\n\tname: 'Uploader',\n\n\t/**\n  * @var {RGUploader} parent\n  */\n\tparent: null,\n\n\t/**\n  * @var {Object} upload elements\n  */\n\t$uploadElement: null,\n\n\t/**\n  * @var {Array} ready upload items\n  */\n\treadyItems: [],\n\n\t/**\n  * @var {Boolean} for check uploading\n  */\n\tuploading: false,\n\n\t/**\n  * init\n  *\n  * @param {RGUploader} parent\n  */\n\tinit: function init(parent) {\n\t\tthis.parent = parent;\n\t},\n\n\n\t/**\n  * push ready upload files\n  *\n  * @param {Object} el [type=file] element\n  */\n\tpushReadyUploadFiles: function pushReadyUploadFiles(el) {\n\t\tvar files = el.files;\n\t\tvar options = this.parent.options;\n\t\tvar limitCount = options.queue.limit;\n\n\t\t// check file count\n\t\tif (files.length > limitCount) {\n\t\t\talert('파일은 총 ' + options.queue.limit + '개까지 업로드할 수 있습니다.');\n\t\t\treturn false;\n\t\t}\n\n\t\t// Add items ready for upload\n\t\tfor (var i = 0; i < files.length; i++) {\n\t\t\tif (!files[i].type) continue;\n\n\t\t\t// check file size\n\t\t\tif (files[i].size > options.limitSize) continue;\n\n\t\t\t// check file extension\n\t\t\tif (options.allowFileTypes.indexOf(files[i].type.split('/')[1]) < 0) continue;\n\n\t\t\t// push upload item\n\t\t\tthis.readyItems.push(files[i]);\n\t\t}\n\t},\n\n\n\t/**\n  * play upload\n  *\n  */\n\tplayUpload: function playUpload() {\n\t\tvar _this = this;\n\n\t\tif (!this.readyItems.length) return false;\n\n\t\t// TODO : 빈 queue를 우선 등록해야함. (progress)\n\n\t\tif (this.parent.options.uploadScript) {\n\t\t\tfileUpload(this.parent.options.uploadScript, this.readyItems[0], function (type, response, file) {\n\t\t\t\tswitch (type) {\n\t\t\t\t\tcase 'progress':\n\t\t\t\t\t\t_this.uploadProgress(response, file);\n\t\t\t\t\t\tbreak;\n\t\t\t\t\tcase 'complete':\n\t\t\t\t\t\t_this.uploadComplete(response, file);\n\t\t\t\t\t\tbreak;\n\t\t\t\t}\n\t\t\t});\n\t\t} else {}\n\t\t// TODO : make local upload\n\n\n\t\t// remove complete item\n\t\tthis.readyItems.splice(0, 1);\n\t},\n\n\n\t/**\n  * upload progress event\n  *\n  * @Param {Object} res\n  * @Param {File} file\n  */\n\tuploadProgress: function uploadProgress(res, file) {\n\t\t// TODO : render 실행\n\t\tlog(res);\n\t},\n\n\n\t/**\n  * upload complete event\n  *\n  * @Param {Object} res\n  * @Param {File} file\n  */\n\tuploadComplete: function uploadComplete(res, file) {\n\t\tswitch (res.state) {\n\t\t\tcase 'success':\n\t\t\t\tlog(res.result);\n\t\t\t\tbreak;\n\t\t\tcase 'error':\n\t\t\t\tlog(res.message);\n\t\t\t\tbreak;\n\t\t}\n\n\t\t// start upload\n\t\tthis.playUpload();\n\t},\n\n\n\t/**\n  * init event\n  *\n  */\n\tinitEvent: function initEvent() {\n\t\tvar self = this;\n\t\tvar $el = this.parent.$container.find('[data-element=addfiles]');\n\t\tvar $extEl = this.parent.options.$externalFileForm;\n\n\t\t// check upload element in container\n\t\tif (!$el.length) return;\n\n\t\tthis.$uploadElement = $el;\n\n\t\t// assign external upload element\n\t\tif ($extEl.length) {\n\t\t\tthis.$uploadElement = this.$uploadElement.add($extEl);\n\t\t}\n\n\t\t// init change event\n\t\tthis.$uploadElement.on('change', function () {\n\t\t\t// check auto upload\n\t\t\tif (self.parent.options.autoUpload) {\n\t\t\t\t// push upload items\n\t\t\t\tself.pushReadyUploadFiles(this);\n\n\t\t\t\t// reset form\n\t\t\t\tresetForm($(this));\n\n\t\t\t\t// start upload\n\t\t\t\tif (!self.uploading) {\n\t\t\t\t\tself.playUpload();\n\t\t\t\t}\n\t\t\t}\n\t\t});\n\t}\n};\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/js/Uploader.js\n ** module id = 2\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/js/Uploader.js?");

/***/ },
/* 3 */
/***/ function(module, exports) {

	eval("'use strict';\n\nvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol ? \"symbol\" : typeof obj; };\n\n/**\n * File upload class\n *\n * @author : redgoose\n * @param {String} action 파일처리 백엔드 url\n * @param {File} file\n * @param {Function} callback\n * @return void\n */\nvar FileUpload = function FileUpload(action, file, callback) {\n\tvar xhr = new XMLHttpRequest();\n\n\tif (typeof FormData === 'function' || (typeof FormData === 'undefined' ? 'undefined' : _typeof(FormData)) === 'object') {\n\t\tvar formData = new FormData();\n\t\tformData.append('file', file);\n\n\t\txhr.open('post', action, true);\n\t\txhr.upload.addEventListener('progress', function (e) {\n\t\t\tif (callback) {\n\t\t\t\tcallback('progress', uploadProgress(e), file);\n\t\t\t}\n\t\t}, false);\n\t\txhr.addEventListener('load', function (e) {\n\t\t\tif (callback) {\n\t\t\t\tcallback('complete', uploadSuccess(e.target), file);\n\t\t\t}\n\t\t});\n\t\txhr.send(formData);\n\t} else {\n\t\tif (callback) {\n\t\t\tcallback('complete', {\n\t\t\t\tstate: 'error',\n\t\t\t\tmessage: 'not support browser'\n\t\t\t});\n\t\t}\n\t}\n};\n\n/**\n * upload progress\n * \n * @Param {XMLHttpRequestProgressEvent} e\n * @Return {object}\n */\nvar uploadProgress = function uploadProgress(e) {\n\tif (e.lengthComputable) {\n\t\treturn { loaded: e.loaded, total: e.total };\n\t}\n};\n\n/**\n * upload success\n *\n * @Param {XMLHttpRequestProgressEvent} e\n * @Param {File} file\n * @Return {Object}\n */\nvar uploadSuccess = function uploadSuccess(e, file) {\n\tif (e.readyState == 4) {\n\t\tswitch (e.status) {\n\t\t\tcase 200:\n\t\t\t\ttry {\n\t\t\t\t\treturn {\n\t\t\t\t\t\tstate: 'success',\n\t\t\t\t\t\tresult: JSON.parse(e.responseText)\n\t\t\t\t\t};\n\t\t\t\t} catch (e) {\n\t\t\t\t\treturn {\n\t\t\t\t\t\tstate: 'error',\n\t\t\t\t\t\tmessage: e.responseText\n\t\t\t\t\t};\n\t\t\t\t}\n\t\t\t\tbreak;\n\t\t\tcase 404:\n\t\t\t\treturn {\n\t\t\t\t\tstate: 'error',\n\t\t\t\t\tmessage: '404 - File not found'\n\t\t\t\t};\n\t\t\t\tbreak;\n\t\t\tcase 403:\n\t\t\t\treturn {\n\t\t\t\t\tstate: 'error',\n\t\t\t\t\tmessage: '403 - Forbidden file type'\n\t\t\t\t};\n\t\t\t\tbreak;\n\t\t\tdefault:\n\t\t\t\treturn {\n\t\t\t\t\tstate: 'error',\n\t\t\t\t\tmessage: 'Unknown Error'\n\t\t\t\t};\n\t\t\t\tbreak;\n\t\t}\n\t}\n\n\treturn {\n\t\tstate: 'error',\n\t\tmessage: 'Unknown Error'\n\t};\n};\n\n// export\nmodule.exports = FileUpload;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/js/FileUpload.js\n ** module id = 3\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/js/FileUpload.js?");

/***/ },
/* 4 */
/***/ function(module, exports) {

	eval("'use strict';\n\n// export\nmodule.exports = {\n\n\t/**\n  * @var {String} component name\n  */\n\tname: 'Queue',\n\n\t/**\n  * @var {RGUploader} parent\n  */\n\tparent: null,\n\n\t/**\n  * init\n  *\n  * @param {RGUploader} parent\n  */\n\tinit: function init(parent) {\n\t\tthis.parent = parent;\n\t}\n};\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/js/Queue.js\n ** module id = 4\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/js/Queue.js?");

/***/ },
/* 5 */
/***/ function(module, exports) {

	eval("\"use strict\";\n\nmodule.exports = null;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/js/Plugins.js\n ** module id = 5\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/js/Plugins.js?");

/***/ },
/* 6 */
/***/ function(module, exports) {

	eval("\"use strict\";\n\nmodule.exports = null;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/js/API.js\n ** module id = 6\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/js/API.js?");

/***/ }
/******/ ]);