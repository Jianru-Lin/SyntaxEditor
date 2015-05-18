function OutputPanel() {
	var editor
	editor = ace.edit(document.querySelector('.output-panel > .content'))
	editor.setTheme("ace/theme/idle_fingers")
	editor.getSession().setMode("ace/mode/text")
	editor.setValue('')

	return {
		line: function(fmt, v) {
			alert('line')
		}
	}
}