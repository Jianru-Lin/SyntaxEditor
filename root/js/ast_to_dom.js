var inspector = undefined

function Inspector() {
	this.func_stack = []
	this.func_list = []
	this.next_lamda_id = 0
}

Inspector.prototype.enter_program = function(ast, dom) {
	var root = {
		is_lamda: false,
		name: '',
		full_name: '',
		dom: dom,
		outside: undefined,
		inside: []
	}
	this.func_stack.push(root)
	this.func_list.push(root)
}

Inspector.prototype.leave_program = function() {
	this.func_stack.pop()
}

Inspector.prototype.enter_func = function(ast, dom) {
	var self = this

	var is_lamda = !ast.id || !ast.id.name
	var name = is_lamda ? 'λ-' + self.next_lamda_id++ : ast.id.name

	var last_func = self.func_stack[self.func_stack.length - 1]

	var func = {
		is_lamda: is_lamda,
		name: name,
		full_name: last_func.full_name + '/' + name,
		dom: dom,
		outside: last_func,
		inside: []
	}

	last_func.inside.push(func)

	self.func_stack.push(func)
	self.func_list.push(func)

	dom.setAttribute('data-func-full-name', func.full_name)

	return func
}

Inspector.prototype.leave_func = function() {
	this.func_stack.pop()
}

var handler_map = {
	'Program': function(ast) {
		var root = div(ast.type)
		inspector.enter_program(ast, root.dom())
		root.append_ast(ast.body)
		inspector.leave_program()
		return root.dom()
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
	'SequenceExpression': function(ast) {
		var root = span(ast.type)
		ast.expressions.forEach(function(exp, i) {
			root.append_ast(exp)
			if (i < ast.expressions.length - 1) {
				root.append(span('comma', 'pre').text(', '))
			}
		})
		return root.dom()
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
					.append(span('bracket', 'left', 'pre').text('{ '))

			var body = span('properties');

			props.forEach(function(prop, i) {

				if (prop.kind === 'get' || prop.kind === 'set') {
					body
						.append(
							span(prop.type)
								.append(span('keyword', 'pre').text(prop.kind + ' '))
								.append_ast(prop.key)
								.append(span('pre').text(': '))
								.append_ast(prop.value))
				}
				else {
					body
						.append(
							span(prop.type)
								.append_ast(prop.key)
								.append(span('pre').text(': '))
								.append_ast(prop.value))
				}


				if (i < props.length - 1) {
					body.append(span('pre', 'comma').text(', '))
				}
			})

			t.append(body)
			t.append(span('bracket', 'right', 'pre').text(' }'))
			return t.dom()
		}
		else {
			return (
				span(ast.type)
					.append(span('bracket', 'left', 'pre').text('{'))
					.append(span('bracket', 'right', 'pre').text('}'))
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
	'ThisExpression': function(ast) {
		return span(ast.type).text('this').dom()
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

		var root = span(ast.type)
		var func = inspector.enter_func(ast, root.dom())

		var content = div('content')
		root
			.append(a('lamda').text('{λ}').attr('href', 'javascript:show_func(\'' + func.full_name + '\');'))
			.append(content)

		try {

			var params = ast.params
			if (params && params.length > 0) {
				content
					.append(span('keyword', 'pre').text('function '))
					.append(span('pre').text('( '))

				params.forEach(function(p, i) {
					content.append_ast(p)
					if (i < params.length - 1) {
						content.append(span('pre').text(', '))
					}
				})

				content
					.append(span('pre').text(' )'))
					.append(
						div('indent')
							.append_ast(ast.body))
			}
			else {
				content
					.append(span('keyword', 'pre').text('function '))
					.append(span('pre').text('()'))
					.append(
						div('indent')
							.append_ast(ast.body))
			}

			return root.dom()

		} finally {
			inspector.leave_func()
		}
	},
	'FunctionDeclaration': function(ast) {

		var root = div(ast.type)
		inspector.enter_func(ast, root.dom())

		try {
			var params = ast.params
			if (params && params.length > 0) {
				root
					.append(span('keyword', 'pre').text('function '))
					.append_ast(ast.id)
					.append(span('pre').text(' ( '))

				params.forEach(function(p, i) {
					root.append_ast(p)
					if (i < params.length - 1) {
						root.append(span('pre').text(', '))
					}
				})

				root
					.append(span('pre').text(' )'))
					.append(
						div('indent')
							.append_ast(ast.body))

				return root.dom()
			}
			else {

				return (
					root
						.append(span('keyword', 'pre').text('function '))
						.append_ast(ast.id)
						.append(span('pre').text(' ()'))
						.append(
							div('indent')
								.append_ast(ast.body))
						.dom()
				)
			}

		} finally {
			inspector.leave_func()
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
		if (ast.handlers && ast.handlers.length > 0) {
			var catch_clause = ast.handlers[0]
			t
				.append(
					span('keyword', 'pre').text('catch '))
				.append_ast(catch_clause.param)
				.append(
					div('indent')
						.append_ast(catch_clause.body))
		}

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
	},
	'SwitchStatement': function(ast) {
		var t =
			div(ast.type)
				.append(span('keyword', 'pre').text('switch '))
				.append_ast(ast.discriminant)
				.append()

		var indent = div('indent')

		var cases = ast.cases
		if (cases && cases.length > 0) {
			t.append(indent)
			cases.forEach(function(c) {
				indent.append_ast(c)
			})
		}

		return t.dom()
	},
	'SwitchCase': function(ast) {
		if (ast.test) {
			return (
				div(ast.type)
					.append(
						span('keyword', 'pre').text('case '))
					.append_ast(ast.test)
					.append(
						div('indent')
							.append_ast(ast.consequent))
			)
		}
		else {
			return (
				div(ast.type)
					.append(
						span('keyword').text('default'))
					.append(
						div('indent')
							.append_ast(ast.consequent))
			)
		}
	}
}

function ast_to_dom(ast) {
	var handler = handler_map[ast.type]
	if (!handler) {
		throw new Error(ast.type)
		//return null
	}
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
