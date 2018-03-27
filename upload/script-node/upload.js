const formidable = require('formidable');
const fs = require('fs');


module.exports = function(req, res)
{
	const form = new formidable.IncomingForm();

	form.parse(req, function (err, fields, files) {
		const oldpath = files.file.path;
		//const newpath = `${__dirname}/../attachments`;
		const newpath = `/Volumes/Datas/redgoose/Sites/tools/rg-Uploader/upload/attachments`;

		// TODO: 파일 업로드 삽질중.. 여기서부터..
		console.log(oldpath, newpath);

		fs.rename(oldpath, newpath, function (err) {
			if (err) throw err;
			res.json({
				foo: 'upload',
			});
		});
	});
};