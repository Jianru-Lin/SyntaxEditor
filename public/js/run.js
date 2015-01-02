function run(src) {
	if (canBlobRun()) {
		blobRun(src)
	}
	else {
		hardRun(src)
	}

	function canBlobRun() {
		var ua = navigator.userAgent
		return !/Trident/i.test(ua) && !/ie/i.test(ua)
	}

	function blobRun(src) {
		url = blobUrl(src)
		console.log(url)

		var form = 
			$('<form>')
				.attr('method', 'POST')
				.attr('action', 'run')
				.attr('target', window.run_target = window.run_target || ('lambda-view run window ' + (new Date())))
				.attr('style', 'display:none')
		var textarea = 
			$('<textarea>')
				.attr('name', 'script_url')
				.val(url)
		form.append(textarea)
		$(document.body).append(form)
		form.submit()
		setTimeout(function() {
			form.remove()
		}, 0)

		function blobUrl(src) {
			var blob = new Blob([src], {type: 'text/javascript'})
			var url = URL.createObjectURL(blob)
			return url
		}
	}

	function hardRun(src) {
		var form = 
			$('<form>')
				.attr('method', 'POST')
				.attr('action', 'run')
				.attr('target', window.run_target = window.run_target || ('lambda-view run window ' + (new Date())))
				.attr('style', 'display:none')
		var textarea = 
			$('<textarea>')
				.attr('name', 'script_content')
				.val(src)
		form.append(textarea)
		$(document.body).append(form)
		form.submit()
		setTimeout(function() {
			form.remove()
		}, 0)
	}

	function simpleRun(src) {
		var w = window.open('about:blank')
		var doc = w.document
		var script = doc.createElement('script')
		script.textContent = src
		doc.body.appendChild(script)
	}
}