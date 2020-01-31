const fs = require('fs');
const express = require('express');
const multer = require('multer');
const detect = require('detect-file-type');
const queryString = require('query-string');
const move = require('./move');

const dir_tmp = './upload/tmp';
const dir_dest = './upload/attachments';
const url_dest = '/attachments';

/**
 * get file list
 *
 * @param {Array} files
 * @return {Promise}
 */
async function getFileList(files)
{
	return new Promise(function(resolve, reject){
    let result = [];
		try
		{
      function push(n)
      {
        detect.fromFile(`${dir_dest}/${files[n]}`, function(err, type) {
          let fileState = fs.statSync(`${dir_dest}/${files[n]}`);
          result.push({
            id: getRandomNumber(11111, 90000) + n,
            name: files[n],
            size: fileState.size,
            src: `${url_dest}/${files[n]}`,
            type: type ? type.mime : null,
          });
          if (files.length - 1 > n)
          {
            push(n+1);
          }
          else
          {
            resolve(result);
          }
        });
      }

      push(0);
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


// routes
module.exports = function(app)
{
  // get data
  app.get('/data', function(req, res) {
    try
    {
      // make dir
      if (!fs.existsSync(`${dir_dest}/`))
      {
        fs.mkdirSync(dir_dest);
      }
      // get files
      let files = fs.readdirSync(`${dir_dest}/`);
      if (files.length)
      {
        getFileList(files).then((result) => {
          return res.json(result);
        }).catch((e) => {
          console.error(e);
          return res.json([]);
        });
      }
      else
      {
        return res.json([]);
      }
    }
    catch(e)
    {
      console.error(e);
      return res.json([]);
    }
  });

  // attachment files
  app.use('/attachments', express.static('upload/attachments'));

  // upload file
  app.post('/upload', multer({ dest: dir_tmp }).single('file'), function(req, res) {
    // make dir
    if (!fs.existsSync(`${dir_dest}/`))
    {
      fs.mkdirSync(dir_dest);
    }

    move(req.file.path, `${dir_dest}/${req.file.originalname}`, function(err) {
      if (err)
      {
        return res.json({ state: 'error', message: 'Upload failed', error: err });
      }
      return res.json({
        state: 'success',
        response: {
          src: `${url_dest}/${req.file.originalname}`,
          name: req.file.originalname,
        }
      });
    });
  });

  // remove file
  app.post('/remove', function(req, res) {
    let bodyStr = '';
    let body = null;

    req.on('data', function(chunk){
      bodyStr += chunk.toString();
    });
    req.on('end', function(){
      try
      {
        body = queryString.parse(bodyStr);
        fs.unlinkSync(`${dir_dest}/${body.name}`);
        res.json({ state: 'success' });
      }
      catch(e)
      {
        console.error(e);
        return res.json({ state: 'error' });
      }
    });
  });
};
