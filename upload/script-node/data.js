module.exports = function(req, res)
{
	res.json([
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
};