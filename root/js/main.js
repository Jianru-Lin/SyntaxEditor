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

	show_func('')
}

function show_func(full_name) {
	full_name = full_name || ''

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
	$(func.dom).clone().addClass('show').appendTo($('#ast-view'))

	// update context
	update_context(func)
}

function update_context(func) {

	$('#outside-function').empty()
	$('#inside-function').empty()
	$('#current-function').empty()

	// outside
	var outside = func.outside
	while (outside) {
		$('#outside-function')
			.prepend(
				$('<a>').attr('href', 'javascript:show_func(\'' + outside.full_name + '\');').text(outside.name || '<program>'))
		outside = outside.outside
	}

	// inside
	if (func.inside && func.inside.length > 0) {
		func.inside.forEach(function(_) {
			if (_.is_lamda) return
			$('#inside-function')
				.append(
					$('<a>').attr('href', 'javascript:show_func(\'' + _.full_name + '\');').text(_.name))
		})
	}

	// current
	$('#current-function')
		.append(
			$('<a>').attr('href', 'javascript:show_func(\'' + func.full_name + '\');').text(func.name || '<program>'))

	function calc_relation(_, target) {
		if (_.length === target.length) { 
			return _ === target ? {same: true} : {neighbor: true}
		}
		else if (_.length > target.length) {
			var tail = _.substring(target.length)
			if (tail[0] === '/') {
				if (tail.substring(1).indexOf('/') === -1) {
					return {outside: true, parent: true}
				}
				else {
					return {outside: true, parent: false}
				}
			}
			else {
				return {neighbor: true}
			}
		}
		else {
			return calc_relation(target, _)
		}
	}
}