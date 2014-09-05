function demo() {
	do {
		console.log('hello')
	} while (a > 100)
}

$(function() {
	var text = demo.toString()
	text = text.substring(17, text.length-2)
	var ast = esprima.parse(text)
	console.log(ast)
	var dom = ast_to_dom(ast)
	$('#ast-view').append(dom)
})

var handler_map = {
	'Program': function(ast) {
		return div2(ast.type).append_ast(ast.body).dom()
	},
	'VariableDeclaration': function(ast) {
		return (
			div2(ast.type)
				.append(span2('keyword', 'pre').text('var '))
				.append(span2('box').append_ast(ast.declarations))
				.dom()
		)
	},
	'VariableDeclarator': function(ast) {
		if (!ast.init) {
			return (
				div2(ast.type).append_ast(ast.id)
			)
		}
		else {
			return (
				div2(ast.type)
					.append(span2('id').append_ast(ast.id))
					.append(span2('equ').text(' = '))
					.append(span2('init').append_ast(ast.init))
					.dom()
			)
		}
	},
	'Identifier': function(ast) {
		return span2(ast.type).text(ast.name).dom()
	},
	'Literal': function(ast) {
		return span2(ast.type).text(ast.raw).dom()
	},
	'IfStatement': function(ast) {
		var d = 
			div2(ast.type)
				.append(
					span2('keyword', 'pre').text('if '))
				.append(
					span2('test')
						.append_ast(ast.test))
				.append(
					div2('indent')
						.append_ast(ast.consequent))

		// else if ...
		return f_else_if(ast.alternate)

		function f_else_if(alternate) {

			if (!alternate) {
				return d.dom()
			}
			else if (alternate.type === 'IfStatement') {
				d
					.append(
						span2('keyword', 'pre').text('else if '))
					.append(
						span2('test')
							.append_ast(alternate.test))
					.append(
						div2('indent')
							.append_ast(alternate.consequent))

					// 继续递归生成 else if ...
					return f_else_if(alternate.alternate)
			}
			else {
				d
					.append(
						span2('keyword').text('else'))
					.append(
						div2('indent')
							.append_ast(alternate))

				return d.dom()
			}
		}
	},
	'BlockStatement': function(ast) {
		return div2(ast.type).append_ast(ast.body).dom()
	},
	'BinaryExpression': function(ast) {
		return (
			div2(ast.type)
				.append_ast(ast.left)
				.append(span2('operator', 'pre').text(' ' + ast.operator + ' '))
				.append_ast(ast.right)
				.dom()
		)
	},
	'UpdateExpression': function(ast) {

		if (ast.prefix) {
			return (
				div2(ast.type)
					.append(span2('operator', 'pre').text(' ' + ast.operator))
					.append_ast(ast.argument)
					.dom()
			)
		}
		else {
			return (
				div2(ast.type)
					.append_ast(ast.argument)
					.append(span2('operator', 'pre').text(' ' + ast.operator))
					.dom()
			)
		}
	},
	'UnaryExpression': function(ast) {
		var d = _class(div(), ast.type)
		if (ast.prefix) {
			append(d, text(_class(div(), 'operator'), ' ' + ast.operator + ' '))
			append(d, ast_to_dom(ast.argument))
		}
		else {
			append(d, ast_to_dom(ast.argument))
			append(d, text(_class(div(), 'operator'), ' ' + ast.operator + ' '))
		}
		return d
	},
	'LogicalExpression': function(ast) {
		var d = _class(div(), ast.type)
		append(d, ast_to_dom(ast.left))
		append(d, text(_class(div(), 'operator'), ' ' + ast.operator + ' '))
		append(d, ast_to_dom(ast.right))
		return d
	},
	'ConditionalExpression': function(ast) {
		var d = _class(div(), ast.type)
		append(d, ast_to_dom(ast.test))
		append(d, text(_class(div(), 'operator'), ' ? '))
		append(d, ast_to_dom(ast.consequent))
		append(d, text(_class(div(), 'operator'), ' : '))
		append(d, ast_to_dom(ast.alternate))
		return d
	},
	'AssignmentExpression': function(ast) {
		var d = _class(div(), ast.type)
		append(d, ast_to_dom(ast.left))
		append(d, text(_class(div(), 'operator'), ' ' + ast.operator + ' '))
		append(d, ast_to_dom(ast.right))
		return d
	},
	'ExpressionStatement': function(ast) {
		var d = _class(div(), ast.type)
		append(d, ast_to_dom(ast.expression))
		return d
	},
	'CallExpression': function(ast) {
		var d = _class(div(), ast.type)
		append(d, ast_to_dom(ast.callee))
		append(d, text(_class(div(), ['bracket', 'left']), '('))
		// arguments
		if (ast.arguments && ast.arguments.length > 0) {
			ast.arguments.forEach(function(arg, i) {
				append(d, ast_to_dom(arg))
				if (i < ast.arguments.length - 1) {
					append(d, text(_class(div(), 'comma'), ', '))
				}
			});
		}
		append(d, text(_class(div(), ['bracket', 'right']), ')'))
		return d
	},
	'ObjectExpression': function(ast) {
		var d = _class(div(), ast.type)
		append(d, text(_class(div(), ['bracket', 'left']), '{'))
		// properties
		if (ast.properties && ast.properties.length > 0) {
			ast.properties.forEach(function(p, i) {
				var _ = _class(div(), p.type)
				append(_, ast_to_dom(p.key))
				append(_, text(_class(div(), 'colon'), ': '))
				append(_, ast_to_dom(p.value))
				append(d, _)
				if (i < ast.properties.length - 1) {
					append(d, text(_class(div(), 'comma'), ', '))
				}
			})
		}
		append(d, text(_class(div(), ['bracket', 'right']), '}'))
		return d
	},
	'ArrayExpression': function(ast) {
		var d = _class(div(), ast.type)
		append(d, text(_class(div(), ['bracket', 'left']), '['))
		// elements
		if (ast.elements && ast.elements.length > 0) {
			ast.elements.forEach(function(e, i) {
				// e can be null
				if (e) {
					append(d, ast_to_dom(e))
					if (i < ast.elements.length - 1) {
						append(d, text(_class(div(), 'comma'), ', '))
					}
				}
				else {
					append(d, text(_class(div(), 'comma'), ', '))
				}
			})
		}
		append(d, text(_class(div(), ['bracket', 'right']), ']'))
		return d
	},
	'NewExpression': function(ast) {
		var d = _class(div(), ast.type)
		append(d, text(_class(div(), 'new'), 'new '))
		append(d, ast_to_dom(ast.callee))
		// arguments
		append(d, text(_class(div(), ['bracket', 'left']), '('))
		if (ast.arguments && ast.arguments.length > 0) {
			ast.arguments.forEach(function(e, i) {
				append(d, ast_to_dom(e))
				if (i < ast.arguments.length - 1) {
					append(d, text(_class(div(), 'comma'), ', '))
				}
			})
		}
		append(d, text(_class(div(), ['bracket', 'right']), ')'))
		return d
	},
	'MemberExpression': function(ast) {
		var prop = ast.property
		if (prop.type === 'Literal' && /^['"]/.test(prop.raw)) {
			return (
				div2(ast.type)
					.append_ast(ast.object)
					.append(span2().text('['))
					.append_ast(prop)
					.append(span2().text(']'))
					.dom()
			)
		}
		else {
			return (
				div2(ast.type)
					.append_ast(ast.object)
					.append(span2().text('.'))
					.append_ast(prop)
					.dom()
			)
		}
	},
	'FunctionExpression': function(ast) {
		return div2(ast.type).text('{λ}').dom()
	},
	'FunctionDeclaration': function(ast) {
		return (
			div2(ast.type)
				.append(span2('keyword', 'pre').text('function '))
				.append_ast(ast.id)
				.append(span2().text('() {}'))
				.dom()
		)
	},
	'DoWhileStatement': function(ast) {
		return (
			div2(ast.type)
				.append(span2('keyword').text('do'))
				.append(
					div2('indent')
						.append_ast(ast.body))
				.append(
					span2('keyword', 'pre').text('while '))
				.append_ast(ast.test)
		)
	}
}

function ast_to_dom(ast) {
	var handler = handler_map[ast.type]
	if (!handler) return null
	else return handler(ast)
}

function ast_list_to_dom(ast_list) {
	if (!ast_list || ast_list.length < 1) return null
	var dom_list = []
	ast_list.forEach(function(ast) {
		var dom = ast_to_dom(ast)
		if (dom) dom_list.push(dom)
	})
	// 绝不会返回空列表，只会返回 null 或非空列表
	if (dom_list.length < 1) return null
	else return dom_list
}

function div() {
	return document.createElement('div')
}

function _class(e, list) {
	if (!e) return
	if (!Array.isArray(list)) list = [list]
	list.forEach(function(c) {
		if (c) e.classList.add(c)
	})
	return e
}

function text(e, v) {
	if (!e) return e
	e.textContent = v
	return e
}

function append(e, list) {
	if (!e) return
	if (!Array.isArray(list)) list = [list]
	list.forEach(function(item) {
		if (item) e.appendChild(item)
	})
	return e
}

function div2() {
	var class_ = []
	for (var i = 0; i < arguments.length; ++i) {
		class_.push(arguments[i])
	}
	return new E('div', class_)
}

function span2() {
	var class_ = []
	for (var i = 0; i < arguments.length; ++i) {
		class_.push(arguments[i])
	}
	return new E('span', class_)
}

function E(name, class_) {
	if (!Array.isArray(class_)) {
		class_ = [class_]
	}

	var e = document.createElement(name)
	class_.forEach(function(c) {
		if (c) e.classList.add(c)
	})

	this.e = e

	return this
}

E.prototype.append = function(target) {
	if (target) {
		if (target.constructor === E) {
			this.e.appendChild(target.e)
		}
		else {
			this.e.appendChild(target)
		}
	}

	return this
}

E.prototype.append_ast = function(ast) {
	var self = this
	if (ast) {
		var ast_list
		if (Array.isArray(ast)) {
			ast_list = ast
		}
		else {
			ast_list = [ast]
		}
		ast_list.forEach(function(a) {
			self.append(ast_to_dom(a))
		})
	}
	return self
}

E.prototype.text = function(t) {
	t = t || ''
	this.e.textContent = t
	return this
}

E.prototype.dom = function() {
	return this.e
}