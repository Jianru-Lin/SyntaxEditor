function OutputPanel() {
	var editor
	editor = ace.edit(document.querySelector('.output-panel > .content'))
	editor.setTheme("ace/theme/idle_fingers")
	editor.getSession().setMode("ace/mode/text")
	editor.setReadOnly(true)
	editor.setShowPrintMargin(false)
	editor.setValue('')

	var instance = {
		editor: editor,
		line: function(fmt, v) {
			var text = tstr(fmt, v)
			text = tstr('[${time}] ${text}\n', {time: new Date().toLocaleTimeString(), text: text})
			this._append(text)
		},
		_insert: function(row, column, text) {
			editor.getSession().insert({row: row, column: column}, text)
		},
		_append: function(text) {
			this._insert(this._lastRow(), this._lastRowLastColumn(), text)
		},
		_lastRow: function() {
			return editor.getSession().getLength()
		},
		_lastRowLastColumn: function() {
			//return editor.getSession().getRowLength(this._lastRow())
			return editor.getSession().getLine(this._lastRow()-1).length
		}
	}

	return instance
}