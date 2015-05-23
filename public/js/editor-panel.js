function EditorPanel() {
	var vm = new Vue({
		el: document.querySelector('.editor-panel'),
		data: {
			noFileOpened: true
		}
	})

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
		_fileName: undefined,
		openFile: function(fileName) {
			this._fileName = fileName
			var content = vfs.retriveFileContent(fileName)
			this.setValue(content)
			vm.noFileOpened = false
		},
		saveFile: function() {
			if (!this._fileName) return
			vfs.updateFileContent(this._fileName, this.getValue())
		},
		closeFile: function() {
			this._fileName = undefined
			this.setValue('')
			vm.noFileOpened = true
		},
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

	vfs.addEventListener(function(e) {
		if (e.type === 'update') {

		}
		else if (e.type === 'delete' && instance._fileName !== undefined && vfs.isSameName(e.name, instance._fileName)) {
			instance.closeFile()
		}
	})

	return instance
}