$(function() {

	window.outputPanel = OutputPanel()
	window.localFilePanel = LocalFilePanel()
	window.editorPanel = EditorPanel()
	window.toolPanel = ToolPanel()

	localFilePanel.onOpen = function(fileName) {
		editorPanel.saveFile()
		editorPanel.closeFile()
		editorPanel.openFile(fileName)
		editorPanel.focus()
		// remember last opened file
		config.lastOpenedFile = fileName
	}

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

	// create default file as needed
	// if (localFilePanel.count() === 0) {
	// 	localFilePanel.add(config.defaultFile.name, config.defaultFile.content)
	// 	localFilePanel.open(config.defaultFile.name)
	// }
	// else {
	// 	localFilePanel.open(config.lastOpenedFile)
	// }
})

window.onbeforeunload = function() {
	editorPanel.saveFile()
}