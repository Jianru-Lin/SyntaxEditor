var editor;
var dom;

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
		dom = ast_to_dom(ast)
	// }
	// catch(e) {
	// 	$('#ast-view').text(e.message)
	// }

	show_root()
}

function show_root() {
	// clear current
	$('#ast-view').empty()
	// show
	$(dom).clone().appendTo($('#ast-view'))
}

function show_func(full_name) {
	// clear current
	$('#ast-view').empty()

	// find target
	var func;
	for (var i = 0; i < inspector.func_list.length; ++i) {
		var _ = inspector.func_list[i]
		if (_.full_name === full_name) {
			func = _
			break
		}
	}

	// not found ?
	if (!func) return

	// show it
	if (func.is_lamda) {
		$(func.dom).clone().addClass('show').appendTo($('#ast-view'))
	}
	else {
		$(func.dom).clone().appendTo($('#ast-view'))
	}
}