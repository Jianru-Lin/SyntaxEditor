;(function(self) {
	'use strict'

	var editor

	$(function() {

		window.outputPanel = new OutputPanel()

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

		if (sessionStorage) {
			onload = function() {
				var lastCode = sessionStorage.getItem('lastCode')
				if (lastCode) {
					editor.setValue(lastCode)
					editor.clearSelection()
					editor.gotoLine(1)
				}
			}

			onunload = function() {
				var lastCode = editor.getValue()
				sessionStorage.setItem('lastCode', lastCode)
			}
		}

		if (localStorage) {

			$('#loadModal').on('show.bs.modal', function() {
				setTimeout(function() {
					$('#loadModal .modal-body input').focus()
				}, 300)
			})

			$('#saveModal').on('show.bs.modal', function() {
				setTimeout(function() {
					$('#saveModal .modal-body input').focus()
				}, 300)
			})

			$('.modal').on('hide.bs.modal', function() {
				editor.focus()
			})

			$('#loadModal .modal-footer .btn-primary').click(function() {
				var name = $('#loadModal .modal-body input').val()
				if (!name) {
					return
				}
				var code = localStorage.getItem(name)
				editor.setValue(code)
				editor.clearSelection()
				editor.gotoLine(1)
				$('#loadModal').modal('hide')
			})

			$('#saveModal .modal-footer .btn-primary').click(function() {
				var name = $('#saveModal .modal-body input').val()
				if (!name) {
					return
				}
				var code = editor.getValue()
				localStorage.setItem(name, code)
				$('#saveModal').modal('hide')
			})

			$('#loadModal form').submit(function(e) {
				e.preventDefault()
				$('#loadModal .modal-footer .btn-primary').click()
			})

			$('#saveModal form').submit(function(e) {
				e.preventDefault()
				$('#saveModal .modal-footer .btn-primary').click()
			})
		}
		
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