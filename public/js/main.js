;(function(self) {
	'use strict'

	var editor

	$(function() {

		editor = ace.edit("editor")
		editor.setTheme("ace/theme/idle_fingers")
		editor.getSession().setMode("ace/mode/javascript")
		editor.setValue('')

		self.compile = compile

		$('#format').click(compile)

		$('#fold-all').click(function() {
			editor.getSession().foldAll()
			focusEditor()
		})

		$('#unfold-all').click(function() {
			editor.getSession().unfold()
			focusEditor()
		})

		$('#run').click(function() {
			var src = editor.getValue()
			run(src)
			focusEditor()
		})
		
		focusEditor()
	})

	function compile() {
		var text = editor.getValue()

		try {
			var ast = parse(text)
		}
		catch (err) {
			throw err
		}

		var newText = self.renderAsText(ast)
		editor.setValue(newText)
		editor.clearSelection()
		editor.gotoLine(1)
		focusEditor()
	}

	function focusEditor() {
		setTimeout(function() {
			editor.focus()
		}, 0)
	}

})(window);