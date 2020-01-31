export const loading = '' +
	'<li class="loading ready">' +
		'<div>' +
			'<figure class="col not-image">' +
				'<p data-element="progress" style="width: 40%;">' +
					'<span><em>40</em>%</span>' +
				'</p>' +
			'</figure>' +
			'<div class="col bar">' +
				'<p data-element="progress" style="width: 30%;">' +
					'<span><em>30</em>%</span>' +
				'</p>' +
			'</div>' +
			'<div class="col bd">' +
				'<span class="name" data-text="filename">filename.jpg</span>' +
				'<hr>' +
				'<span class="state" data-text="state">ready</span>' +
			'</div>' +
			'<nav class="col" data-element="removeQueue">' +
				'<button type="button" title="remove queue"><i class="material-icons">close</i></button>' +
			'</nav>' +
		'</div>' +
	'</li>';

export const error = '' +
	'<li class="error">' +
		'<div>' +
			'<figure class="col not-image"></figure>' +
			'<div class="col bd">' +
				'<span class="filetype bracket large" data-text="filetype">image/jpg</span>' +
				'<span class="name" data-text="filename">filename.jpg</span>' +
				'<hr>' +
				'<span class="state" data-text="state">upload fail</span>' +
			'</div>' +
		'</div>' +
	'</li>';

export const complete = '' +
	'<li class="complete">' +
		'<div>' +
			'<figure class="col" data-element="previewImage" data-text="filename">filename.jpg</figure>' +
			'<div class="col bd">' +
				'<span class="filetype bracket large" data-text="filetype">image/jpg</span>' +
				'<span class="name" data-text="filename">filename.jpg</span>' +
				'<hr>' +
				'<span class="state" data-text="state">uploaded</span>' +
				'<span class="size bracket" data-text="filesize">123.43kb</span>' +
			'</div>' +
			'<nav class="col" data-element="customButtons"></nav>' +
		'</div>' +
	'</li>';
