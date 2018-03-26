'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = function (action, file, params, filter) {
	var defer = _jquery2.default.Deferred();

	if (action) {
		// server upload
		var xhr = new XMLHttpRequest();

		if (typeof FormData === 'function' || (typeof FormData === 'undefined' ? 'undefined' : _typeof(FormData)) === 'object') {
			var formData = new FormData();
			// append params
			formData.append('file', file);
			if (params && (typeof params === 'undefined' ? 'undefined' : _typeof(params)) === 'object') {
				for (var o in params) {
					formData.append(o, params[o]);
				}
			}
			// open xhr
			xhr.open('post', action, true);
			// progress event
			xhr.upload.addEventListener('progress', function (e) {
				defer.notify(uploadProgress(e), file);
			}, false);
			// loaded event
			xhr.addEventListener('load', function (e) {
				var src = uploadSuccess(e.target);

				// filtering response
				src = util.getFunctionReturn(filter, src);

				switch (src.state) {
					case 'success':
						defer.resolve(src.response, file);
						break;
					case 'error':
						defer.reject(src.response.message, file);
						break;
				}
			});
			xhr.send(formData);
		} else {
			defer.reject('not support browser', file);
		}
	} else {
		// local upload
		if (FileReader) {
			var reader = new FileReader();
			reader.onload = function (e) {
				defer.resolve({
					src: e.target.result,
					isLocalFile: true
				}, file);
			};
			reader.readAsDataURL(file);
		} else {
			defer.reject('not support browser', file);
		}
	}

	return defer.promise();
};

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _util = require('./util');

var util = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * upload progress
 *
 * @Param {XMLHttpRequestProgressEvent} e
 * @Return {object}
 */
function uploadProgress(e) {
	if (e.lengthComputable) {
		return { loaded: e.loaded, total: e.total };
	}
}

/**
 * upload success
 *
 * @Param {XMLHttpRequestProgressEvent} e
 * @Param {File} file
 * @Return {Object}
 */
function uploadSuccess(e, file) {
	if (e.readyState === 4) {
		switch (e.status) {
			case 200:
				var response = e.responseText;
				try {
					return JSON.parse(response) || response;
				} catch (e) {
					return {
						state: 'error',
						response: {
							message: response
						}
					};
				}
				break;
			case 404:
				return {
					state: 'error',
					response: {
						message: '404 - File not found'
					}
				};
				break;
			case 403:
				return {
					state: 'error',
					response: {
						message: '403 - Forbidden file type'
					}
				};
				break;
			default:
				return {
					state: 'error',
					response: {
						message: 'Unknown Error'
					}
				};
				break;
		}
	}

	return {
		state: 'error',
		response: {
			message: 'Unknown Error'
		}
	};
}

/**
 * file upload class
 *
 * @author : redgoose
 * @param {String} action 파일처리 백엔드 url
 * @param {File} file
 * @param {Object} params
 * @param {Function} filter
 * @return {Object}
 */
;