function demo() {
	var a = 100;
	var b = 200;
}

$(function() {
	var ast = esprima.parse(demo.toString())
	console.log(ast)
	var dom = ast_to_dom(ast)
	
})

function ast_to_dom(ast) {

}