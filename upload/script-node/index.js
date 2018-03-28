const fs = require('fs');
const multer = require('multer');
const move = require('./move');

const dir_tmp = 'upload/tmp';
const dir_dest = 'upload/attachments';


module.exports = function(app)
{
	// get data
	app.get('/data', function(req, res) {
		return res.json([
			{
				id : 8742867877,
				name : 'img-demo-1.jpg',
				size : 53710,
				src : 'https://goose.redgoose.me/data/upload/original/201803/rg-20180315-000424.jpg',
				type : 'image/jpeg'
			},
			{
				id : 6860860674,
				name : 'img-demo-2.jpg',
				size : 129454,
				src : 'https://goose.redgoose.me/data/upload/original/201803/rg-20171112-000415.jpg',
				type : 'image/jpeg'
			},
			{
				id : 5860269672,
				name : 'img-demo-3.jpg',
				size : 103811,
				src : 'https://goose.redgoose.me/data/upload/original/201708/rg-20170725-000241.jpg',
				type : 'image/jpeg'
			}
		]);
	});

	// upload file
	app.post('/upload', multer({ dest: dir_tmp }).single('file'), function(req, res) {
		move(req.file.path, `${dir_dest}/${req.file.originalname}`, function(err) {
			if (err)
			{
				return res.json({
					state: 'error',
					message: err
				});
			}
			return res.json({
				state: 'success',
				response: {
					src: `./${dir_dest}/${req.file.originalname}`,
					name: req.file.originalname,
				}
			});
		});
	});

	// remove file
	app.post('/remove', function(req, res) {
		res.json({ foo: 'remove' });
	});
};