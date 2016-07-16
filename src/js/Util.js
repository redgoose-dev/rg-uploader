// Util module

module.exports = {

	name : 'Util',
	
	/**
	 * byte to size convert
	 *
	 * @Param {Number} bytes
	 * @Return {String}
	 */
	bytesToSize(bytes)
	{
		var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
		if (bytes == 0) return '0';
		var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
		return Math.round(bytes / Math.pow(1024, i), 2) + '' + sizes[i];
	},

	/**
	 * find DOM
	 *
	 * @Param {Object} $con
	 * @Param {String} key
	 * @Param {String} name
	 * @Return {Object}
	 */
	findDOM($con, key, name)
	{
		return $con.find('[data-' + key + '=' + name + ']');
	},

	/**
	 * get unique number
	 *
	 * @Param {int} length
	 * @Return {int}
	 */
	getUniqueNumber(length)
	{
		length = length || 10;
		var timestamp = +new Date;

		var _getRandomInt = function( min, max ) {
			return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
		};

		var ts = timestamp.toString();
		var parts = ts.split( "" ).reverse();
		var id = "";

		for( var i = 0; i < length; ++i ) {
			var index = _getRandomInt( 0, parts.length - 1 );
			id += parts[index];
		}

		return parseInt(id);
	},

	/**
	 * detect touch event
	 *
	 * @Return {Boolean}
	 */
	detectTouchEvent()
	{
		return 'ontouchstart' in document.documentElement;
	}

};