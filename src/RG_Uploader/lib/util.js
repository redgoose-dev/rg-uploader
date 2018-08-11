/**
 * byte to size convert
 *
 * @param {Number} bytes
 * @return {String}
 */
export function bytesToSize(bytes)
{
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	if (bytes === 0) return '0';
	const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
	return Math.round(bytes / Math.pow(1024, i), 2) + '' + sizes[i];
}


/**
 * find DOM
 *
 * @param {Object} $con
 * @param {String} key
 * @param {String} name
 * @return {Object}
 */
export function findDOM($con, key, name)
{
	if (!($con && $con.length)) return null;
	return $con.find('[data-' + key + '=' + name + ']');
}


/**
 * get unique number
 *
 * @param {int} length
 * @return {int}
 */
export function getUniqueNumber(length)
{
	length = length || 10;

	const timestamp = +new Date;
	const _getRandomInt = function( min, max )
	{
		return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
	};

	const ts = timestamp.toString();
	const parts = ts.split( "" ).reverse();
	let id = "";

	for( let i = 0; i < length; ++i )
	{
		const index = _getRandomInt( 0, parts.length - 1 );
		id += parts[index];
	}

	return parseInt(id);
}


/**
 * detect touch event
 *
 * @return {Boolean}
 */
export function detectTouchEvent()
{
	return 'ontouchstart' in document.documentElement;
}


/**
 * reset input[type=file]
 *
 * @param {Object} input
 */
export function inputFileReset(input)
{
	let win10ie11 = !!navigator.userAgent.match(/Trident.*rv[ :]?[1-9]{2}\./);
	let ie = (navigator.appVersion.indexOf("MSIE ") !== -1);
	let ie10 = (navigator.appVersion.indexOf("MSIE 10") !== -1);

	if (ie10)
	{
		// is IE10
		input.type = 'radio';
		input.type = 'file';
	}
	else if (ie || win10ie11)
	{
		// is IE
		const orgParent = input.parentNode;
		const orgNext = input.nextSibling;

		let tmp = document.createElement('form');
		tmp.appendChild(input);
		tmp.reset();

		orgParent.insertBefore(input, orgNext);
	}
	else
	{
		// etc
		input.value = '';
	}
}


/**
 * get function return
 *
 * @param {Function} func
 * @param {Object} src
 * @param params
 * @return {Object}
 */
export function getFunctionReturn(func, src, params)
{
	if (!func || !(typeof func === 'function')) return src;
	return func(src, params) || src;
}
