;(function(self) {
	'use strict'

	var editor
	var lastText
	var ast
	var astDom

	$(function() {
		editor = ace.edit("source-code")
		editor.setTheme("ace/theme/idle_fingers")
		editor.getSession().setMode("ace/mode/javascript")
		editor.setValue('')

		self.compile = compile
	})

	function compile() {
		var text = editor.getValue()
		if (text === lastText) return
		try {
			ast = parse(text)
		} catch (err) {
			throw err
		}
		ast = self.analyze(ast)
		astDom = self.render(ast)
		gotoCode('Program/')
	}

	function gotoCode(path) {
		
	}

})(window);