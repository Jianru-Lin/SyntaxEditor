function demo(a, b, c) {
	a.b.c
	a[b.c]
}

$(function() {
	var text = demo.toString()
	var ast = esprima.parse(text)
	console.log(ast)
	var dom = ast_to_dom(ast)
	$('#ast-view').append(dom)
})

var handler_map = {
	'Program': function(ast) {
		return div(ast.type).append_ast(ast.body).dom()
	},
	'VariableDeclaration': function(ast) {
		return (
			div(ast.type)
				.append(span('keyword', 'pre').text('var '))
				.append(span('box').append_ast(ast.declarations))
				.dom()
		)
	},
	'VariableDeclarator': function(ast) {
		if (!ast.init) {
			return (
				div(ast.type).append_ast(ast.id).dom()
			)
		}
		else {
			return (
				div(ast.type)
					.append(span('id').append_ast(ast.id))
					.append(span('equ').text(' = '))
					.append(span('init').append_ast(ast.init))
					.dom()
			)
		}
	},
	'Identifier': function(ast) {
		return span(ast.type).text(ast.name).dom()
	},
	'Literal': function(ast) {
		return span(ast.type).text(ast.raw).dom()
	},
	'IfStatement': function(ast) {
		var d = 
			div(ast.type)
				.append(
					span('keyword', 'pre').text('if '))
				.append(
					span('test')
						.append_ast(ast.test))
				.append(
					div('indent')
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
						span('keyword', 'pre').text('else if '))
					.append(
						span('test')
							.append_ast(alternate.test))
					.append(
						div('indent')
							.append_ast(alternate.consequent))

					// 继续递归生成 else if ...
					return f_else_if(alternate.alternate)
			}
			else {
				d
					.append(
						span('keyword').text('else'))
					.append(
						div('indent')
							.append_ast(alternate))

				return d.dom()
			}
		}
	},
	'BlockStatement': function(ast) {
		return div(ast.type).append_ast(ast.body).dom()
	},
	'BinaryExpression': function(ast) {
		return (
			span(ast.type)
				.append_ast(ast.left)
				.append(span('operator', 'pre').text(' ' + ast.operator + ' '))
				.append_ast(ast.right)
				.dom()
		)
	},
	'UpdateExpression': function(ast) {

		if (ast.prefix) {
			return (
				span(ast.type)
					.append(span('operator', 'pre').text(ast.operator + ' '))
					.append_ast(ast.argument)
					.dom()
			)
		}
		else {
			return (
				span(ast.type)
					.append_ast(ast.argument)
					.append(span('operator', 'pre').text(' ' + ast.operator))
					.dom()
			)
		}
	},
	'UnaryExpression': function(ast) {
		if (ast.prefix) {
			return (
				span(ast.type)
					.append(span('operator', 'pre').text(ast.operator + ' '))
					.append_ast(ast.argument)
					.dom()
			)
		}
		else {
			return (
				span(ast.type)
					.append_ast(ast.argument)
					.append(span('operator', 'pre').text(' ' + ast.operator))
					.dom()
			)
		}
	},
	'LogicalExpression': function(ast) {
		return (
			span(ast.type)
				.append_ast(ast.left)
				.append(span('operator', 'pre').text(' ' + ast.operator + ' '))
				.append_ast(ast.right)
				.dom()
		)
	},
	'ConditionalExpression': function(ast) {
		return (
			span(ast.type)
				.append(span().text('('))
				.append_ast(ast.test)
				.append(span('operator', 'pre').text(' ? '))
				.append_ast(ast.consequent)
				.append(span('operator', 'pre').text(' : '))
				.append_ast(ast.alternate)
				.append(span().text(')'))
				.dom()
		)
	},
	'AssignmentExpression': function(ast) {
		return (
			span(ast.type)
				.append_ast(ast.left)
				.append(span('operator', 'pre').text(' ' + ast.operator + ' '))
				.append_ast(ast.right)
				.dom()
		)
	},
	'ExpressionStatement': function(ast) {
		return div(ast.type).append_ast(ast.expression).dom()
	},
	'CallExpression': function(ast) {
		var args = ast.arguments
		if (args && args.length > 0) {

			var t =
				span(ast.type)
					.append_ast(ast.callee)
					.append(span('pre').text('( '))
		
			ast.arguments.forEach(function(arg, i) {
				t.append_ast(arg)
				if (i < ast.arguments.length - 1) {
					t.append(span('pre').text(', '))
				}
			})

			t.append(span('pre').text(' )'))
			return t.dom()
		}
		else {

			return (
				span(ast.type)
					.append_ast(ast.callee)
					.append(span().text('()'))
					.dom()
			)

		}
	},
	'ObjectExpression': function(ast) {

		var props = ast.properties

		if (props && props.length > 0) {

			var t =
				span(ast.type)
					.append(span('pre').text('{ '))

			props.forEach(function(prop, i) {

				if (prop.kind === 'get' || prop.kind === 'set') {
					t
						.append(
							span(prop.type)
								.append(span('keyword', 'pre').text(prop.kind + ' '))
								.append_ast(prop.key)
								.append(span('pre').text(': '))
								.append_ast(prop.value))
				}
				else {
					t
						.append(
							span(prop.type)
								.append_ast(prop.key)
								.append(span('pre').text(': '))
								.append_ast(prop.value))
				}


				if (i < props.length - 1) {
					t.append(span('pre').text(', '))
				}
			})

			t.append(span('pre').text(' }'))
			return t.dom()
		}
		else {
			return (
				span(ast.type)
					.append(span('pre').text('{}'))
					.dom()
			)
		}

	},
	'ArrayExpression': function(ast) {
		var elements = ast.elements
		if (elements && elements.length > 0) {
			var t = 
				span(ast.type)
					.append(span('pre').text('[ '))

			elements.forEach(function(e, i) {
				t.append_ast(e)
				if (i < elements.length - 1) {
					t.append(span('pre').text(', '))
				}
			})

			t.append(span('pre').text(' ]'))
			return t.dom()
		}
		else {
			return (
				span(ast.type)
					.append(span('pre').text('[]'))
					.dom()
			)
		}
	},
	'NewExpression': function(ast) {
		var args = ast.arguments
		if (args && args.length > 0) {

			var t =
				span(ast.type)
					.append(span('pre').text('new '))
					.append_ast(ast.callee)
					.append(span().text('('))

			args.forEach(function(arg, i) {
				t.append_ast(arg)
				if (i < args.length - 1) {
					t.append(span().text(', '))
				}
			})

			t.append(span().text(')'))
			return t.dom()

		}
		else {

			return (
				span(ast.type)
					.append(span('pre').text('new '))
					.append_ast(ast.callee)
					.append(span().text('()'))
					.dom()
			)

		}
	},
	'MemberExpression': function(ast) {
		var prop = ast.property
		if ((prop.type === 'Literal' && /^['"]/.test(prop.raw))
			|| ast.computed) {
			return (
				span(ast.type)
					.append_ast(ast.object)
					.append(span().text('['))
					.append_ast(prop)
					.append(span().text(']'))
					.dom()
			)
		}
		else {
			return (
				span(ast.type)
					.append_ast(ast.object)
					.append(span().text('.'))
					.append_ast(prop)
					.dom()
			)
		}
	},
	'FunctionExpression': function(ast) {
		return span(ast.type).text('{λ}').dom()
	},
	'FunctionDeclaration': function(ast) {
		var params = ast.params
		if (params && params.length > 0) {
			var t = 
				div(ast.type)
					.append(span('keyword', 'pre').text('function '))
					.append_ast(ast.id)
					.append(span('pre').text('( '))

			params.forEach(function(p, i) {
				t.append_ast(p)
				if (i < params.length - 1) {
					t.append(span('pre').text(', '))
				}
			})

			t
				.append(span('pre').text(' )'))
				.append(
					div('indent')
						.append_ast(ast.body))

			return t.dom()
		}
		else {

			return (
				div(ast.type)
					.append(span('keyword', 'pre').text('function '))
					.append_ast(ast.id)
					.append(span().text('()'))
					.append(
						div('indent')
							.append_ast(ast.body))
					.dom()
			)
		}
	},
	'ReturnStatement': function(ast) {
		if (ast.argument) {
			return (
				div(ast.type)
					.append(span('keyword', 'pre').text('return '))
					.append_ast(ast.argument)
					.dom()
			)
		}
		else {
			return (
				div(ast.type)
					.append(span('keyword').text('return'))
					.dom()
			)
		}
	},
	'DoWhileStatement': function(ast) {
		return (
			div(ast.type)
				.append(span('keyword').text('do'))
				.append(
					div('indent')
						.append_ast(ast.body))
				.append(
					span('keyword', 'pre').text('while '))
				.append_ast(ast.test)
				.dom()
		)
	},
	'WhileStatement': function(ast) {
		return (
			div(ast.type)
				.append(span('keyword', 'pre').text('while '))
				.append_ast(ast.test)
				.append(
					div('indent')
						.append_ast(ast.body))
				.dom()
		)
	},
	'ContinueStatement': function(ast) {
		if (ast.label) {
			return (
				div(ast.type)
					.append(span('keyword', 'pre').text('continue '))
					.append_ast(ast.label)
					.dom()
			)
		}
		else {
			return (
				div(ast.type)
					.append(span('keyword').text('continue'))
					.dom()
			)
		}
	},
	'BreakStatement': function(ast) {
		if (ast.label) {
			return (
				div(ast.type)
					.append(span('keyword', 'pre').text('break '))
					.append_ast(ast.label)
					.dom()
			)
		}
		else {
			return (
				div(ast.type)
					.append(span('keyword').text('break'))
					.dom()
			)
		}
	},
	'LabeledStatement': function(ast) {
		return (
			div(ast.type)
				.append(
					div('label', 'pre')
						.append_ast(ast.label)
						.append(span().text(':')))
				.append(
					div('indent')
						.append_ast(ast.body))
				.dom()
		)
	},
	'ForStatement': function(ast) {
		return (
			div(ast.type)
				.append(
					span('keyword', 'pre').text('for '))
				.append(
					span('pre').text('( '))
				.append_ast(ast.init)
				.append(
					span('pre').text('; '))
				.append_ast(ast.test)
				.append(
					span('pre').text('; '))
				.append_ast(ast.update)
				.append(
					span('pre').text(' )'))
				.append(
					div('indent')
						.append_ast(ast.body))
				.dom()
		)
	},
	'ForInStatement': function(ast) {
		return (
			div(ast.type)
				.append(
					span('keyword', 'pre').text('for '))
				.append(
					span('pre').text('( '))
				.append_ast(ast.left)
				.append(
					span('keyword', 'pre').text(' in '))
				.append_ast(ast.right)
				.append(
					span('pre').text(' )'))
				.append(
					div('indent')
						.append_ast(ast.body))
				.dom()
		)
	},
	'EmptyStatement': function(ast) {
		return div().text(';').dom()
	},
	'WithStatement': function(ast) {
		return (
			div(ast.type)
				.append(
					span('keyword', 'pre').text('with '))
				.append(
					span('pre').text('( '))
				.append_ast(ast.object)
				.append(
					span('pre').text(' )'))
				.append(
					div('indent')
						.append_ast(ast.body))
				.dom()
		)
	},
	'SwitchStatement': function(ast) {
		var t =
			div(ast.type)
				.append(span('keyword', 'pre').text('switch '))
				.append(span('pre').text('( '))
				.append_ast(ast.type)
				.append(span('pre').text(' )'))

		return t.dom()
	},
	'ThrowStatement': function(ast) {
		return (
			div(ast.type)
				.append(span('keyword','pre').text('throw '))
				.append_ast(ast.argument)
				.dom()
		)
	},
	'DebuggerStatement': function(ast) {
		return div(ast.type).append(span('keyword').text('debugger')).dom()
	},
	'TryStatement': function(ast) {
		// try
		var t = 
			div(ast.type)
				.append(
					span('keyword').text('try'))
				.append(
					div('indent')
						.append_ast(ast.block))

		// catch
		var catch_clause = ast.handlers[0]
		t
			.append(
				span('keyword', 'pre').text('catch '))
			.append_ast(catch_clause.param)
			.append(
				div('indent')
					.append_ast(catch_clause.body))

		// finally
		if (ast.finalizer) {
			t
				.append(
					span('keyword').text('finally'))
				.append(
					div('indent')
						.append_ast(ast.finalizer))
		}

		return t.dom()
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
	var class_ = []
	for (var i = 0; i < arguments.length; ++i) {
		class_.push(arguments[i])
	}
	return new E('div', class_)
}

function span() {
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