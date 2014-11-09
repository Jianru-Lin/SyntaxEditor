;(function(self) {

	self.translate = translate

	var ctx = new TranslateContext()

	var ruleTable = self.ruleTable = self.ruleTable || {
		'Program': [children('body')],

		'EmptyStatement': undefined,

		'BlockStatement': [children('body')],

		'ExpressionStatement': [children('expression'), semicolon, br],

		'IfStatement': function(ast) {
			if (!ast.alternate) {
				return [
					keyword('if'), sp_opt, bracket(children('test')), sp_opt, brace(br, indent(children('consequent'))), br
				]
			}
			else {
				return [
					keyword('if'), sp_opt, bracket(children('test')), sp_opt, brace(br, indent(children('consequent'))), br,
					function() {
						if (ast.alternate.type !== 'IfStatement') {
							return [keyword('else'), sp_opt, brace(br, indent(children('alternate'))), br]
						}
						else {
							return [keyword('else'), sp, children('alternate')]
						}
					}
				]
			}
		},

		'LabeledStatement': [children('label'), colon, sp_opt, children('body')],

		'ContinueStatement': [keyword('continue'), semicolon, br],

		'WithStatement': [keyword('with'), sp_opt, bracket(children('object')), sp_opt, brace(br, indent(children('body'))), br],

		'SwitchStatement': [keyword('switch'), sp_opt, bracket(children('discriminant')), sp_opt, brace(br, indent(children('cases'))), br],

		'ReturnStatement': function (ast) {
			if (ast.argument)
				return [keyword('return'), sp, children('argument'), semicolon, br]
			else
				return [keyword('return'), semicolon, br]
		},

		'ThrowStatement': [keyword('throw'), sp, children('argument'), semicolon, br],

		'TryStatement': function(ast) {
			return [
				keyword('try'), sp_opt, brace(br, indent(children('block'))), br,
				children('handlers'), 
				function() {
					if (ast.finalizer) {
						return [keyword('finally'), sp_opt, brace(br, indent(children('finalizer'))), br]
					}
				}
			]
		},

		'WhileStatement': [keyword('while'), sp_opt, bracket(children('test')), sp_opt, brace(br, indent(children('body'))), br],

		'DoWhileStatement': [keyword('do'), sp_opt, brace(br, indent(children('body'))), sp_opt, keyword('while'), sp_opt, bracket(children('test')), br],

		'ForStatement': function(ast) {
			if (ast.init && ast.init.type === 'VariableDeclaration') {
				ast.init.parentIsForInStatement = true
			}
			return [
				keyword('for'), sp_opt, 
				bracket(
					children('init'), semicolon, 
					test_leading_sp, children('test'), semicolon, 
					update_leading_sp, children('update')), sp_opt, 
				brace(br, indent(children('body'))), br]

			function test_leading_sp() {
				if (ast.test) {
					return sp_opt
				}
			}

			function update_leading_sp() {
				if (ast.update) {
					return sp_opt
				}
			}
		},

		'ForInStatement': function (ast) {
			if (ast.left.type === 'VariableDeclaration') {
				ast.left.parentIsForInStatement = true
			}
			return [keyword('for'), sp_opt, bracket(children('left'), sp, keyword('in'), sp, children('right')), sp_opt, brace(br, indent(children('body'))), br]
		},

		'ForOfStatement': undefined,

		'LetStatement': undefined,

		'DebuggerStatement': [keyword('debugger'), semicolon, br],

		'FunctionDeclaration': [keyword('function'), sp, children('id'), sp_opt, bracket(childrenJoin('params', [comma, sp_opt])), sp_opt, brace(br, indent(children('body'))), br],

		'VariableDeclaration': function(ast) {
			if (ast.parentIsForInStatement) {
				return [keyword('var'), sp, childrenJoin('declarations', [comma, sp_opt])]
			}
			else {
				return [keyword('var'), sp, childrenJoin('declarations', [comma, sp_opt]), semicolon, br]
			}
		},

		'VariableDeclarator': function (ast) {
			return ast.init ? [children('id'), sp_opt, operator('='), sp_opt, children('init')] : [children('id')]
		},

		'ThisExpression': keyword('this'),

		'ArrayExpression': [square_bracket(childrenJoin('elements', [comma, sp_opt]))],

		'ObjectExpression': function(ast) {
			if (ast.properties && ast.properties.length > 0)
				return [brace(br, indent(childrenJoin('properties', [comma, br])), br)]
			else
				return [brace()]
		},

		'Property': [children('key'), colon, sp_opt, children('value')],

		'FunctionExpression': function (ast) {
			if (ast.id) {
				return [keyword('function'), sp, children('id'), sp_opt, bracket(childrenJoin('params', [comma, sp_opt])), sp_opt, brace(br, indent(children('body')))]
			}
			else {
				return [keyword('function'), sp, bracket(childrenJoin('params', [comma, sp_opt])), sp_opt, brace(br, indent(children('body')))]
			}
		},

		'ArrowExpression': undefined,

		'SequenceExpression': function () {
			// TODO Priority Problem
			return [bracket(childrenJoin('expressions', [comma, sp_opt]))]
		},

		'UnaryExpression': function(node) {
			if (node.prefix) {
				return [operator_prop, sp, children('argument')]
			}
			else {
				return [children('argument'), sp, operator_prop]
			}
		},

		'BinaryExpression': [children('left'), sp_opt, operator_prop, sp_opt, children('right')],

		'AssignmentExpression': [children('left'), sp_opt, operator_prop, sp_opt, children('right')],

		'UpdateExpression': function(node) {
			if (node.prefix) {
				return [operator_prop, sp_opt, children('argument')]
			}
			else {
				return [children('argument'), sp_opt, operator_prop]
			}
		},

		'LogicalExpression': [children('left'), sp_opt, operator_prop, sp_opt, children('right')],

		'ConditionalExpression': [bracket(children('test'), sp_opt, operator('?'), sp_opt, children('consequent'), sp_opt, operator(':'), sp_opt, children('alternate'))],

		'NewExpression': [keyword('new'), sp, children('callee'), sp_opt, bracket(childrenJoin('arguments', [comma, sp_opt]))],

		'CallExpression': [children('callee'), sp_opt, bracket(childrenJoin('arguments', [comma, sp_opt]))],

		'MemberExpression': function (ast) {
			if (ast.computed)
				return [children('object'), square_bracket(children('property'))]
			else
				return [children('object'), operator('.'), children('property')]
		},

		'YieldExpression': undefined,

		'ComprehensionExpression': undefined,

		'GeneratorExpression': undefined,

		'GraphExpression': undefined,

		'GraphIndexExpression': undefined,

		'LetExpression': undefined,

		'ObjectPattern': undefined, // check Mozilla Doc before implement this

		'ArrayPattern': undefined,

		'SwitchCase': function(ast) {
			if (ast.test) {
				return [keyword('case'), sp, children('test'), colon, br, indent(children('consequent'))]
			}
			else {
				return [keyword('default'), colon, br, indent(children('consequent'))]
			}
		},

		'BreakStatement': [keyword('break'), semicolon, br],

		'CatchClause': [keyword('catch'), sp_opt, bracket(children('param')), sp_opt, brace(br, indent(children('body'))), br],

		'ComprehensionBlock': undefined,

		'Identifier': function(astNode, parentVast) {
			// esprima says undefined is an identifier not a literal. see issue #1
			var vast = Vast.span('identifier', astNode.name)
			parentVast.children.push(vast)
		},

		'Literal': function(astNode, parentVast) {
			var raw = astNode.raw
			var value = astNode.value

			switch (typeof value) {
				case 'string':
					var vast = Vast.span('literal string', raw)
					break
				case 'boolean':
					var vast = Vast.span('literal boolean', raw)
					break
				case 'number':
					var vast = Vast.span('literal number', raw)
					break
				case 'undefined':
					// here won't be reached cause issue #1
					var vast = Vast.span('literal undefined', 'undefined')
					break
				case 'object':
					if (value === null) {
						var vast = Vast.span('literal null', 'null')
					}
					else if (value.constructor === RegExp) {
						var vast = Vast.span('literal regexp', value.toString())
					}
					else {
						throw new Error('unsupported type of literal: ' + typeof value)
					}
					break
				default:
					throw new Error('unsupported type of literal: ' + typeof value)
			}

			parentVast.children.push(vast)
		}
	}

	function translate(ast) {

		ctx.reset()
		ctx.astStack.push(ast)
		ctx.vastStack.push(Vast.div('vast'))
		var rule = ruleTable[ast.type]
		execRule(rule)
		return ctx.vastStack.top()

	}

	function TranslateContext() {
		this.astStack = new Stack()
		this.vastStack = new Stack()
	}

	TranslateContext.prototype.reset = function() {
		this.astStack = new Stack()
		this.vastStack = new Stack()
	}

	function Stack() {
		this.list = []
	}

	Stack.prototype.push = function(e) {
		this.list.push(e)
	}

	Stack.prototype.pop = function() {
		this.list.pop()
	}

	Stack.prototype.top = function() {
		return this.list[this.list.length - 1]
	}

	Stack.prototype.bottom = function() {
		return this.list[0]
	}


	function execRule(rule) {
		if (rule === undefined || rule === null) return;
		if (Array.isArray(rule)) {
			execArrayRule(rule)
		}
		else if (typeof rule === 'function') {
			execFunctionRule(rule)
		}
		else {
			throw new Error('unsupported type of rule: ' + typeof rule)
		}

		function execArrayRule(arrayRule) {
			arrayRule.forEach(execRule)
		}

		function execFunctionRule(funcRule) {
			return execRule(funcRule(ctx.astStack.top(), ctx.vastStack.top()))
		}
	}

	function childrenJoin(name, between) {
		return function() {
			return join(children(name)(), between)
		}
	}

	// * expansible
	function children(name) {
		return function() {
			var children = ctx.astStack.top()[name]

			if (children === null || children === undefined) {
				// ignore
				return
			}

			if (Array.isArray(children)) {
				var list = []
				children.forEach(function(child) {
					list.push(access(child))
				})
				return list
			}
			else if (typeof children === 'object') {
				return access(children)
			}
			else {
				debugger
				throw new Error('children(): unknown children type: ' + typeof children)
			}
		}
	}

	// * basic
	function access(ast) {
		return function() {
			var rule = ruleTable[ast.type]
			if (!rule) {
				console.log('rule not found: ' + ast.type)
				return
			}
			ctx.astStack.push(ast)
			execRule(rule)
			ctx.astStack.pop()
		}
	}

	// * expansible
	function join(arr, sep) {
		return function() {
			if (arr === undefined || arr === null) {
				return
			}

			if (arr.length < 1 || sep === undefined || sep === null) {
				return arr
			}

			var result = []
			arr.forEach(function(arrItem) {
				result.push(arrItem)
				result.push(sep)
			})
			result.pop() // remove last sep
			return result
		}
	}

	function operator_prop(ast, parentVast) {
		var vast = Vast.span('operator', ast.operator)
		parentVast.children.push(vast)
	}

	// * basic
	function keyword(text) {
		return function () {
			ctx.vastStack.top().children.push(Vast.span('keyword ' + text, text))
		}
	}

	// * basic
	function br() {
		ctx.vastStack.top().children.push(Vast.br())
	}

	// * basic
	function sp() {
		ctx.vastStack.top().children.push(Vast.span('space', ' '))
	}

	// * basic
	function sp_opt() {
		ctx.vastStack.top().children.push(Vast.span('space optional', ' '))
	}

	// * basic
	function operator(text) {
		return function () {
			ctx.vastStack.top().children.push(Vast.span('operator', text))
		}
	}

	// * basic
	function semicolon() {
		ctx.vastStack.top().children.push(Vast.span('semicolon', ';'))
	}

	// * expansible
	function brace() {
		return _folding_pair('brace', '{', '}', toArray(arguments))
	}

	// * expansible
	function bracket() {
		return _folding_pair('bracket', '(', ')', toArray(arguments))
	}

	// * expansible
	function square_bracket() {
		return _folding_pair('square_bracket', '[', ']', toArray(arguments))
	}

	function _folding_pair(name, pair_left, pair_right, funcs) {
		return function () {
			var left = Vast.span(name + ' left', pair_left)
			var right = Vast.span(name + ' right', pair_right)
			left.metaData = {
				folding: {
					to: right.id
				}
			}
			right.metaData = {
				folding: {
					backward: true,
					to: left.id
				}
			}
			
			return [
				function() {
					ctx.vastStack.top().children.push(left)
				},
				funcs,
				function() {
					ctx.vastStack.top().children.push(right)
				}
			]
		}
	}

	// * basic
	function comma() {
		ctx.vastStack.top().children.push(Vast.span('comma', ','))				
	}

	// * basic
	function colon() {
		ctx.vastStack.top().children.push(Vast.span('colon', ':'))				
	}

	// * expansible
	function indent() {
		var funcs = toArray(arguments)
		return function () {
			var indentSection = Vast.sectionMark('indent')
			return [
				function() {
					ctx.vastStack.top().children.push(indentSection.enter)
				},
				funcs,
				function() {
					ctx.vastStack.top().children.push(indentSection.leave)
				}
			]
		}
	}

	function toArray(args) {
		return [].slice.apply(args)
	}
}) (window);