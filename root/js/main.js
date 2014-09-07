var editor;

$(function() {
	editor = ace.edit("source-code")
	editor.setTheme("ace/theme/idle_fingers")
	editor.getSession().setMode("ace/mode/javascript")
	editor.setValue('')
})

function compile() {

	if (!editor) return

	var text = editor.getValue()
	// try {
		var ast = esprima.parse(text)
		inspector = new Inspector()
		var dom = ast_to_dom(ast)
		$('#ast-view').empty().append(dom)
	// }
	// catch(e) {
	// 	$('#ast-view').text(e.message)
	// }
}