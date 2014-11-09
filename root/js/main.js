;(function(self) {
	'use strict'

	var editor
	var lastText
	var astDom

	$(function() {
		editor = ace.edit("main-editor")
		editor.setTheme("ace/theme/idle_fingers")
		editor.getSession().setMode("ace/mode/javascript")
		editor.setValue('')

		self.compile = compile

		$.get('test/demo-all.txt', function(text) {
			editor.setValue(text)
			$('a[href="#after"]').click()
		})
	})

	function compile() {
		var text = editor.getValue()
		if (text === lastText) return
		try {
			var ast = parse(text)
		} catch (err) {
			$('#ast-view').empty()
			throw err
		}
		var o = self.render(ast)
		astDom = o.dom
		window.metaDataTable = o.metaDataTable
		$('#ast-view').empty().append(astDom)
	}

})(window);