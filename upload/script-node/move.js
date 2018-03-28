// https://stackoverflow.com/a/29105404
const fs = require('fs');


module.exports = function move(oldPath, newPath, callback)
{
	fs.rename(oldPath, newPath, function (err) {
		if (err)
		{
			if (err.code === 'EXDEV')
			{
				copy();
			}
			else
			{
				callback(err);
			}
			return;
		}
		callback();
	});

	function copy() {
		const readStream = fs.createReadStream(oldPath);
		const writeStream = fs.createWriteStream(newPath);

		readStream.on('error', callback);
		writeStream.on('error', callback);

		readStream.on('close', function () {
			fs.unlink(oldPath, callback);
		});

		readStream.pipe(writeStream);
	}
};