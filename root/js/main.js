;(function(self) {
	'use strict'

	var beforeEditor
	var afterEditor
	var lastBeforeText
	var astDom

	$(function() {

		beforeEditor = ace.edit("source-code")
		beforeEditor.setTheme("ace/theme/idle_fingers")
		beforeEditor.getSession().setMode("ace/mode/javascript")
		beforeEditor.setValue('')

		afterEditor = ace.edit("formatted-code")
		afterEditor.setTheme("ace/theme/idle_fingers")
		afterEditor.getSession().setMode("ace/mode/javascript")
		afterEditor.setValue('')

		self.compile = compile

		// $.get('test/demo-all.txt', function(text) {
		// 	beforeEditor.setValue(text)
		// 	$('a[href="#after"]').click()
		// })

		$('#run').click(function() {
			var src = afterEditor.getValue()
			run(src)
		})
	})

	function compile() {
		var beforeText = beforeEditor.getValue()
		if (beforeText === lastBeforeText) {
			return
		}
		lastBeforeText = beforeText

		afterEditor.setValue('')
		try {
			var ast = parse(beforeText)
		}
		catch (err) {
			throw err
		}

		var afterText = self.renderAsText(ast)
		afterEditor.setValue(afterText)
		afterEditor.clearSelection()
		afterEditor.gotoLine(1)
		afterEditor.session.foldAll()
	}

})(window);