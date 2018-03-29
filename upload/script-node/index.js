const fs = require('fs');
const multer = require('multer');
const detect = require('detect-file-type');

const move = require('./move');

const dir_tmp = './upload/tmp';
const dir_dest = './upload/attachments';


module.exports = function(app)
{
	//app.use(express.bodyParser());

	// get data
	app.get('/data', function(req, res) {
		try
		{
			let files = fs.readdirSync(`${dir_dest}/`);

			getFileList(files).then((result) => {
				return res.json(result);
			}).catch((e) => {
				console.error(e);
				return res.json([]);
			});
		}
		catch(e)
		{
			console.error(e);
			return res.json([]);
		}
	});

	// upload file
	app.post('/upload', multer({ dest: dir_tmp }).single('file'), function(req, res) {
		move(req.file.path, `${dir_dest}/${req.file.originalname}`, function(err) {
			if (err)
			{
				return res.json({ state: 'error', message: err });
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
		let bodyStr = '';

		req.on("data",function(chunk){
			bodyStr += chunk.toString();
		});
		req.on("end",function(){
			// TODO: 여기까지 작업했음. object로 변환해야함.
			console.log(bodyStr);
			res.json({ foo: 'remove' });
		});
	});
};


/**
 * get file list
 *
 * @param {Array} files
 * @return {Promise}
 */
function getFileList(files)
{
	return new Promise(function(resolve, reject){
		let result = [];

		try
		{
			files.forEach((file, k) => {
				detect.fromFile(`${dir_dest}/${file}`, function(err, type) {
					let fileState = fs.statSync(`${dir_dest}/${file}`);
					result.push({
						id: getRandomNumber(11111, 99999) + k,
						name: file,
						size: fileState.size,
						src: `${dir_dest}/${file}`,
						type: type.mime,
					});

					if (k === files.length - 1)
					{
						resolve(result);
					}
				});
			});
		}
		catch(e)
		{
			reject(e);
		}
	});
}


/**
 * get random number
 *
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 */
function getRandomNumber(min, max)
{
	return Math.floor(Math.random() * (max - min)) + min;
}