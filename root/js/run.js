function run(src) {
	hardRun(src)

	function hardRun(src) {
		newForm(src).submit()

		function newForm(src) {
			var form = e('form')
			form.method = 'POST'
			form.action = 'run'
			form.target = window.run_target = window.run_target || ('lambda-view run window ' + (new Date()))
			var input = e('input', form)
			input.name = 'script_content'
			input.value = src
			return form

			function e(name, parent) {
				var element = document.createElement(name)
				if (parent !== undefined) {
					parent.appendChild(element)					
				}
				return element
			}
		}
	}

	function simpleRun(src) {
		var w = window.open('about:blank')
		var doc = w.document
		var script = doc.createElement('script')
		script.textContent = src
		doc.body.appendChild(script)
	}
}