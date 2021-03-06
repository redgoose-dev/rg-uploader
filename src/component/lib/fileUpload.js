import $ from 'jquery';
import * as util from './util';

/**
 * upload progress
 *
 * @Param {XMLHttpRequestProgressEvent} e
 * @Return {object}
 */
function uploadProgress(e)
{
	if (e.lengthComputable)
	{
		return { loaded : e.loaded, total : e.total };
	}
}

/**
 * upload success
 *
 * @Param {XMLHttpRequestProgressEvent} e
 * @Param {File} file
 * @Return {Object}
 */
function uploadSuccess(e, file)
{
	if (e.readyState === 4)
	{
		switch (e.status)
		{
			case 200:
				let response = e.responseText;
				try {
					return JSON.parse(response) || response;
				} catch(e) {
					return {
						state : 'error',
						response : {
							message : response
						}
					};
				}
				break;
			case 404:
				return {
					state : 'error',
					response : {
						message : '404 - File not found'
					}
				};
				break;
			case 403:
				return {
					state : 'error',
					response : {
						message : '403 - Forbidden file type'
					}
				};
				break;
			default:
				return {
					state : 'error',
					response : {
						message : 'Unknown Error'
					}
				};
				break;
		}
	}

	return {
		state : 'error',
		response : {
			message : 'Unknown Error'
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
 * @param {Object} headers
 * @param {Function} filter
 * @return {Object}
 */
export default function(action, file, params, headers, filter)
{
	const defer = $.Deferred();

	if (action && typeof action === 'string')
	{
		// server upload
		const xhr = new XMLHttpRequest();

		if (typeof FormData === 'function' || typeof FormData === 'object')
		{
			let formData = new FormData();
			// append params
			formData.append('file', file);
			if (params && (typeof params === 'object'))
			{
				for (let o in params)
				{
					formData.append(o, params[o]);
				}
			}
			// open xhr
			xhr.open('post', action, true);
			// set header
			if (headers && typeof headers === 'object')
			{
				Object.keys(headers).forEach(function(o) {
					xhr.setRequestHeader(o, headers[o]);
				});
			}
			// progress event
			xhr.upload.addEventListener('progress', function (e) {
				defer.notify(uploadProgress(e), file);
			}, false);
			// loaded event
			xhr.addEventListener('load', function (e) {
				let src = uploadSuccess(e.target);

				// filtering response
				src = filter(src);

				switch(src.state) {
					case 'success':
						defer.resolve(src.response, file);
						break;
					case 'error':
						defer.reject(src.message, file);
						break;
				}
			});
			xhr.send(formData);
		}
		else
		{
			defer.reject('not support browser', file);
		}
	}
  // local upload
	else if (FileReader)
	{
    let reader = new FileReader();
    reader.onload = (e) => {
      defer.resolve({
        src : e.target.result,
        isLocalFile : true
      }, file);
    };
    reader.readAsDataURL(file);
	}
	else
  {
    defer.reject('not support browser', file);
  }

	return defer.promise();
};
