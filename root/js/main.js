function compile() {
	var text = document.getElementById('source-code').innerText
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