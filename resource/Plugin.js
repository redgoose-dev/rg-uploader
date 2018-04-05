'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Plugin = function () {
	function Plugin(parent) {
		_classCallCheck(this, Plugin);

		this.parent = parent;
		this.names = [];
		this.child = {};
	}

	/**
  * event listener
  *
  * queue.changeStyle
  * queue.selectQueue
  * queue.addProgress
  * queue.updateProgress
  * queue.uploadComplete
  * queue.removeQueue
  *
  * @Param {String} type
  * @Param {Any} value
  */


	_createClass(Plugin, [{
		key: 'eventListener',
		value: function eventListener(type, value) {
			var _this = this;

			this.names.forEach(function (name) {
				var evt = _this.child[name].eventListener;
				if (!evt || !(typeof evt === 'function')) return;
				evt(type, value);
			});
		}

		/**
   * error plugin
   * 플러그인 작동에 문제가 생겨 호출되어 객체를 삭제한다.
   *
   * @Param {String} childName error plugin name
   */

	}, {
		key: 'error',
		value: function error(childName) {
			this.names.splice(this.names.indexOf(childName), 1);
			delete this.child[childName];
		}

		/**
   * init
   */

	}, {
		key: 'init',
		value: function init() {
			var _this2 = this;

			// init plugins
			var items = this.parent.options.plugin;
			if (items && items.length) {
				items.forEach(function (item) {
					if (!item.name) return;
					if (!item.obj || !(_typeof(item.obj) === 'object')) return;
					if (!item.obj.init || !(typeof item.obj.init === 'function')) return;

					_this2.names.push(item.name);
					_this2.child[item.name] = item.obj;

					// play init()
					_this2.child[item.name].init(_this2.parent);
				});
			}
		}
	}]);

	return Plugin;
}();

exports.default = Plugin;