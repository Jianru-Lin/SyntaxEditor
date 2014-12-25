function run(src) {
	var w = window.open('about:blank')
	var doc = w.document
	var script = doc.createElement('script')
	script.textContent = src
	doc.body.appendChild(script)
}