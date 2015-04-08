var express = require('express');
var router = express.Router();
var fs = require('fs')
var path = require('path')

// next script id
var nextId = new Date().valueOf()

try {
	fs.mkdirSync(relativeCacheDir())
}
catch(err) {
	// ignore
	// console.log(err.toString())
}

router.post('/run', function(req, res) {
	
	var script_url = !req.body ? '' : (!req.body.script_url ? '' : req.body.script_url)

	if (script_url) {
		res.render('run', {
			title: 'Run',
			src: script_url
		})
		return;
	}

	var script_content = !req.body ? '' : (!req.body.script_content ? '' : req.body.script_content)

	var id = nextId++
	var fileName = relativeCacheDir(id + '.js')
	try {
		fs.writeFileSync(fileName, script_content)
		res.statusCode = 302
		res.setHeader('Location', 'run/' + id)
		res.end()
	}
	catch (err) {
		console.log(err.toString())
		res.end()
	}
});

router.get('/run/:id', function(req, res) {
	var id = req.params.id
	var fileName = relativeCacheDir(id + '.js')
	var src = '../cache/' + id + '.js'
	res.render('run', {
		title: 'Run',
		src: src
	})
})

function relativeCacheDir(name) {
	name = name || ''
	return path.resolve(__dirname, '../public/cache', name)
}

module.exports = router;
