function EditorPanel() {
	var editor
	ace.require("ace/ext/language_tools")
	editor = ace.edit("editor")
	editor.setTheme("ace/theme/idle_fingers")
	editor.getSession().setMode("ace/mode/javascript")
	editor.setValue('')
	editor.setOptions({
		enableBasicAutocompletion: true,
		enableSnippets: true,
		enableLiveAutocompletion: true
	})

	var instance = {
		getValue: function() {
			return editor.getValue()
		},
		setValue: function(v) {
			editor.setValue(v)
			editor.clearSelection()
			editor.gotoLine(1)
		},
		foldAll: function() {
			editor.getSession().foldAll()
		},
		unfoldAll: function() {
			editor.getSession().unfold()
		},
		focus: function() {
			setTimeout(function() {
				editor.focus()
			}, 0)
		}
	}

	return instance
}