$(function() {

	window.outputPanel = OutputPanel()
	window.localFilePanel = LocalFilePanel()
	window.editorPanel = EditorPanel()
	window.toolPanel = ToolPanel()

	toolPanel.onFormat = function() {

		var text = editorPanel.getValue()

		try {
			var ast = parse(text)
		}
		catch (err) {
			throw err
		}

		var newText = self.renderAsText(ast)
		editorPanel.setValue(newText)
		editorPanel.focus()
	}

	toolPanel.onFoldAll = function() {
		editorPanel.foldAll()
		editorPanel.focus()
	}

	toolPanel.onUnFoldAll = function() {
		editorPanel.unfoldAll()
		editorPanel.focus()
	}

	toolPanel.onRun = function() {
		var src = editorPanel.getValue()
		run(src)
		editorPanel.focus()
	}

	editorPanel.focus()
})

window.onbeforeunload = function() {
	return confirm('refresh?')
}