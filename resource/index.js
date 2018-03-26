'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _Uploader = require('./Uploader');

var _Uploader2 = _interopRequireDefault(_Uploader);

var _Queue = require('./Queue');

var _Queue2 = _interopRequireDefault(_Queue);

var _Plugin = require('./Plugin');

var _Plugin2 = _interopRequireDefault(_Plugin);

var _lib = require('./lib');

var lib = _interopRequireWildcard(_lib);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RG_Uploader = function () {

	/**
  * constructor
  *
  * @param {Object} el HTMLElement
  * @param {Object} options
  */
	function RG_Uploader(el) {
		var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

		_classCallCheck(this, RG_Uploader);

		// check container element
		if (!el) return;

		// merge options
		this.options = _extends({}, lib.defaultOptions, options);
		if (options && options.queue) {
			this.options.queue = _extends({}, lib.defaultOptions.queue, options.queue);
		}

		// set container element
		this.$container = (0, _jquery2.default)(el);

		// init sub modules
		this.plugin = new _Plugin2.default(this);
		this.queue = new _Queue2.default(this);
		this.uploader = new _Uploader2.default(this);

		// init plugin
		this.plugin.init();

		// init queue
		this.queue.init();

		// play init(external)
		if (this.options.init && typeof this.options.init === 'function') {
			this.options.init(this);
		}
	}

	/**
  * event receiver
  *
  * @Param {String} type
  * @Param {*} value
  */


	_createClass(RG_Uploader, [{
		key: 'eventReceiver',
		value: function eventReceiver(type, value) {
			this.plugin.eventListener(type, value);
		}
	}]);

	return RG_Uploader;
}();

exports.default = RG_Uploader;