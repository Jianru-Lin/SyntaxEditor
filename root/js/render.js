;(function(self) {

	self.render = render
	self = {
		walkAST: self.walkAST
	}

	function render(ast) {
		var vast = self.astToVast(ast)
		var dom = self.vastToDom(vast)
		return dom
	}

	;(function(self) {
		self.astToVast = astToVast


		function astToVast(ast) {
			var vast = execRuleTable(ast)
			vast = fillIndent(vast)
			return vast
		}

		function fillIndent(vast) {
			if (!vast.children || vast.children.length < 1) return vast

			var willIndentList = []

			calcIndentDetail()
			applyIndent()

			return vast

			function calcIndentDetail() {
				var ctx = {
					elementList: vast.children
				}

				var lastLineNo
				var lastIndentId

				while (lineOrientedEat(ctx)) {
					var currentLineNo = ctx.lineNo
					var currentIndentId = ctx.indentStack[ctx.indentStack.length - 1]
					if ((currentLineNo !== lastLineNo) || (currentIndentId !== lastIndentId)) {
						// this is where we want to do indent :)
						// but indent zero is meaningless so we will ignore it
						var indentLevel = ctx.indentStack.length
						var elementPos = ctx.nextElementPos - 1
						if (indentLevel > 0) {
							willIndentList.push({
								elementPos: elementPos,
								indentLevel: indentLevel
							})							
						}
					}
					lastLineNo = currentLineNo
					lastIndentId = currentIndentId
				}
			}

			function lineOrientedEat(ctx) {
				// ctx:
				// - [out]     lineNo
				// ...
				// (base on indentOrientedEat)

				if (ctx.lineNo === undefined)
					ctx.lineNo = 0

				while (indentOrientedEat(ctx)) {
					if (isBr(ctx.element)) {
						++ctx.lineNo
					}
					else {
						return true
					}
				}

				// meet the end
				return false
			}

			function indentOrientedEat(ctx) {
				// ctx:
				// - [out]     indentStack
				// - [*]       nextIndentId
				// ...
				// (base on eat)

				if (ctx.indentStack === undefined)
					ctx.indentStack = []

				while (eat(ctx)) {
					if (isIndentEnter(ctx.element)) {
						enter()
					}
					else if (isIndentLeave(ctx.element)) {
						leave()
					}
					else {
						// ok, done
						return true
					}
				}

				// end
				return false

				function enter() {
					if (ctx.nextIndentId === undefined)
						ctx.nextIndentId = 0

					ctx.indentStack.push(ctx.nextIndentId++)
				}

				function leave() {
					ctx.indentStack.pop()
				}
			}

			function applyIndent() {
				// do insert indent

				var indentMap = []
				willIndentList.forEach(function(willIndent) {
					indentMap[willIndent.elementPos] = {
						name: 'span',
						text: makeIndentSpace(willIndent.indentLevel)
					}
				})

				var newChildren = []
				vast.children.forEach(function(c, i) {
					var indent = indentMap[i]
					if (indent) newChildren.push(indent)
					newChildren.push(c)
				})
				vast.children = newChildren

				function makeIndentSpace(level) {
					if (level < 1) {
						return ''
					}
					else {
						var unit = '    '
						var list = []
						for (var i = 0; i < level; ++i) {
							list.push(unit)
						}
						return list.join('')
					}
				}
			}

			function eat(ctx) {
				// ctx:
				// - [in]      elementList
				// - [out]     element
				// - [*]       nextElementPos

				if (ctx.nextElementPos === undefined) {
					ctx.nextElementPos = 0
				}

				if (ctx.nextElementPos < ctx.elementList.length) {
					ctx.element = ctx.elementList[ctx.nextElementPos]
					++ctx.nextElementPos
					return true
				}
				else {
					return false
				}
			}

			// function peekNext(cb) {
			// 	if (!cb) debugger
			// 	var target = vast.children[i]
			// 	if (!target) return false
			// 	else return cb(target)
			// }

			function isIndentEnter(target) {
				return target.notDom && target.name === 'indent' && target.type === 'enter'
			}

			function isIndentLeave(target) {
				return target.notDom && target.name === 'indent' && target.type === 'leave'
			}

			function isBr(target) {
				return !target.notDom && target.name === 'br'
			}

		}

		function execRuleTable(ast) {

			var astStack = [ast]

			var vastStack = [div('vast')]

			var ruleTable = {
				'Program': [recursive('body')],

				'EmptyStatement': undefined,

				'BlockStatement': [recursive('body')],

				'ExpressionStatement': [recursive('expression'), sp_opt, semicolon, br],

				'IfStatement': function(ast) {
					if (!ast.alternate) {
						return [
							keyword('if'), sp_opt, left_bracket, recursive('test'), right_bracket, sp_opt, left_brace, br, 
							indent(recursive('consequent')), right_brace, br
						]
					}
					else {
						return [
							keyword('if'), sp_opt, left_bracket, recursive('test'), right_bracket, sp_opt, left_brace, br, 
							indent(recursive('consequent')), right_brace, br,
							function() {
								if (ast.alternate.type !== 'IfStatement') {
									return [keyword('else'), sp_opt, left_brace, br, indent(recursive('alternate')), right_brace, br]
								}
								else {
									return [keyword('else'), sp, recursive('alternate')]
								}
							}
						]
					}
				},

				'LabeledStatement': [recursive('label'), recursive('body')],

				'ContinueStatement': keyword('continue'),

				'WithStatement': [recursive('object'), recursive('body')],

				'SwitchStatement': [recursive('discriminant'), recursive('cases')],

				'ReturnStatement': function (ast) {
					if (ast.argument)
						return [keyword('return'), sp, recursive('argument'), sp_opt, semicolon, br]
					else
						return [keyword('return'), sp_opt, semicolon, br]
				},

				'ThrowStatement': [recursive('argument')],

				'TryStatement': [recursive('block'), recursive('handlers'), recursive('guardedHandlers'), recursive('finalizer')],

				'WhileStatement': [recursive('test'), recursive('body')],

				'DoWhileStatement': [recursive('body'), recursive('test')],

				'ForStatement': [recursive('init'), recursive('test'), recursive('update'), recursive('body')],

				'ForInStatement': [recursive('left'), recursive('right'), recursive('body')],

				'ForOfStatement': undefined,

				'LetStatement': undefined,

				'DebuggerStatement': [keyword('debugger'), sp_opt, semicolon, br],

				// done
				'FunctionDeclaration': [keyword('function'), sp, recursive('id'), sp_opt, left_bracket, recursive('params', combine(comma, sp_opt)), right_bracket, sp_opt, left_brace, br, indent(recursive('body')), right_brace, br],

				'VariableDeclaration': [keyword('var'), sp, recursive('declarations'), sp_opt, semicolon],

				'VariableDeclarator': function (ast) {
					return ast.init ? [recursive('id'), sp_opt, operator('='), sp_opt, recursive('init')] : [recursive('id')]
				},

				'ThisExpression': keyword('this'),

				'ArrayExpression': [recursive('elements')],

				'ObjectExpression': [recursive('properties')],

				'Property': [recursive('key'), recursive('value')],

				// done
				'FunctionExpression': function (ast) {
					if (ast.id) {
						return [keyword('function'), sp, recursive('id'), sp_opt, left_bracket, recursive('params', combine(comma, sp_opt)), right_bracket, sp_opt, left_brace, br, indent(recursive('body')), right_brace]
					}
					else {
						return [keyword('function'), sp, left_bracket, recursive('params', combine(comma, sp_opt)), right_bracket, sp_opt, left_brace, br, indent(recursive('body')), right_brace]
					}
				},

				'ArrowExpression': undefined,

				'SequenceExpression': [recursive('expressions')],

				'UnaryExpression': function(node) {
					if (node.prefix) {
						return [operator_prop, sp, recursive('argument')]
					}
					else {
						return [recursive('argument'), sp, operator_prop]
					}
				},

				'BinaryExpression': [recursive('left'), sp_opt, operator_prop, sp_opt, recursive('right')],

				'AssignmentExpression': [recursive('left'), sp_opt, operator_prop, sp_opt, recursive('right')],

				'UpdateExpression': function(node) {
					if (node.prefix) {
						return [operator_prop, sp_opt, recursive('argument')]
					}
					else {
						return [recursive('argument'), sp_opt, operator_prop]
					}
				},

				'LogicalExpression': [recursive('left'), sp_opt, operator_prop, sp_opt, recursive('right')],

				// done
				'ConditionalExpression': [left_bracket, recursive('test'), sp_opt, operator('?'), sp_opt, recursive('consequent'), sp_opt, operator(':'), sp_opt, recursive('alternate'), right_bracket],

				// done
				'NewExpression': [keyword('new'), sp, recursive('callee'), sp_opt, left_bracket, recursive('arguments', combine(comma, sp_opt)), right_bracket],

				// done
				'CallExpression': [recursive('callee'), sp_opt, left_bracket, recursive('arguments', combine(comma, sp_opt)), right_bracket],

				'MemberExpression': function (ast) {
					if (ast.computed)
						return [recursive('object'), left_square_bracket, recursive('property'), right_square_bracket]
					else
						return [recursive('object'), operator('.'), recursive('property')]
				},

				'YieldExpression': undefined,

				'ComprehensionExpression': undefined,

				'GeneratorExpression': undefined,

				'GraphExpression': undefined,

				'GraphIndexExpression': undefined,

				'LetExpression': undefined,

				'ObjectPattern': undefined, // check Mozilla Doc before implement this

				'ArrayPattern': undefined,

				'SwitchCase': [recursive('test'), recursive('consequent')],

				'CatchClause': [recursive('param'), recursive('guard'), recursive('body')],

				'ComprehensionBlock': undefined,

				'Identifier': function(astNode, parentVast) {
					// esprima says undefined is an identifier not a literal. see issue #1
					var vast = {
						name: 'span',
						_class: 'identifier',
						text: astNode.name
					}
					parentVast.children.push(vast)
				},

				'Literal': function(astNode, parentVast) {
					var raw = astNode.raw
					var value = astNode.value

					switch (typeof value) {
						case 'string':
							var vast = {
								name: 'span',
								_class: 'literal string',
								text: raw.length < 3 ? '' : "'" + raw.substring(1, raw.length - 1) + "'"
							}
							break
						case 'boolean':
							var vast = {
								name: 'span',
								_class: 'literal boolean',
								text: raw
							}
							break
						case 'number':
							var vast = {
								name: 'span',
								_class: 'literal number',
								text: raw
							}
							break
						case 'undefined':
							// here won't be reached cause issue #1
							var vast = {
								name: 'span',
								_class: 'literal undefined',
								text: 'undefined'
							}
							break
						case 'object':
							if (value === null) {
								var vast = {
									name: 'span',
									_class: 'literal null',
									text: 'null'
								}
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


			var rule = ruleTable[ast.type]

			execRule(rule)

			return currentVast() // must be vastStack[0] the root

			function execRule(rule) {

				switch (typeof rule) {
					case 'undefined':
						// ignore
						break
					case 'string':
						execStringRule(rule)
						break
					case 'object':
						if (rule === null) {
							// ignore
						}
						else if (Array.isArray(rule)) {
							execArrayRule(rule)
						}
						else {
							throw new Error('object is not a rule.')
						}
						break
					case 'function':
						execFunctionRule(rule)
						break
					default:
						throw new Error('unsupported type of rule: ' + typeof rule)
				}

				function execStringRule(strRule) {
					currentVast().children.push(span(undefined, strRule))
				}

				function execArrayRule(arrayRule) {
					arrayRule.forEach(execRule)
				}

				function execFunctionRule(funcRule) {
					return execRule(funcRule(currentAst(), currentVast()))
				}
			}

			function recursive(prop, between) {
				return function() {
					var subAst = currentAst()[prop]

					switch (typeof subAst) {
						case 'undefined':
							// ignore
							break
						case 'object':
							if (subAst === null) {
								// ignore
								return
							}
							else if (Array.isArray(subAst)) {
								if (typeof between === 'function') {
									var subAstList = subAst
									subAstList.forEach(function(subAstItem, i) {
										into(subAstItem)
										if (i < subAst.length - 1) {
											between()
										}
									})				
								}
								else {
									subAst.forEach(into)
								}
							}
							else {
								into(subAst)
							}
							break
						default:
							throw new Error('u can not recursive on type: ' + typeof subAst)
					}
				}

				function into(ast) {
					var rule = ruleTable[ast.type]
					if (!rule) {
						console.log('rule not found: ' + ast.type)
						return
					}
					pushAst(ast)
					execRule(rule)
					popAst()
				}

				function join(arr, sep) {
					if (sep === undefined || sep === null) {
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

			function combine() {
				var a = arguments
				return function() {
					for (var i = 0, len = a.length; i < len; ++i) {
						a[i]()
					}
				}
			}

			function operator_prop(ast, parentVast) {
				var vast = {
					name: 'span',
					_class: 'operator',
					text: ast.operator
				}
				parentVast.children.push(vast)
			}

			function pushVast(target) {
				return vastStack.push(target)
			}

			function popVast() {
				return vastStack.pop()
			}

			function currentVast() {
				return vastStack[vastStack.length - 1]
			}

			function pushAst(target) {
				return astStack.push(target)
			}

			function popAst() {
				return astStack.pop()
			}

			function currentAst() {
				return astStack[astStack.length - 1]
			}

			function div(_class, text) {
				return {
					name: 'div',
					_class: _class,
					text: text,
					children: []
				}
			}

			function span(_class, text) {
				return {
					name: 'span',
					_class: _class,
					text: text,
					children: []
				}
			}

			function keyword(text) {
				return function () {
					currentVast().children.push(span('keyword', text))
				}
			}

			function br() {
				currentVast().children.push({
					name: 'br'
				})
			}

			function sp() {
				currentVast().children.push(span('space', ' '))
			}

			function sp_opt() {
				currentVast().children.push(span('space optional', ' '))
			}

			function operator(text) {
				return function () {
					currentVast().children.push(span('operator', text))
				}
			}

			function semicolon() {
				currentVast().children.push(span('semicolon', ';'))
			}

			function left_brace() {
				currentVast().children.push(span('brace left', '{'))
			}

			function right_brace() {
				currentVast().children.push(span('brace right', '}'))
			}

			function left_bracket() {
				currentVast().children.push(span('bracket left', '('))
			}

			function right_bracket() {
				currentVast().children.push(span('bracket right', ')'))
			}

			function left_square_bracket() {
				currentVast().children.push(span('square_bracket left', '['))
			}

			function right_square_bracket() {
				currentVast().children.push(span('square_bracket right', ']'))
			}

			function comma() {
				currentVast().children.push(span('comma', ','))				
			}

			function indent() {
				var funcs = arguments
				return function () {
					
					var indentSection = sectionMark('indent')
					currentVast().children.push(indentSection.enter)

					for (var i = 0, len = funcs.length; i < len; ++i) {
						funcs[i].apply(undefined, arguments)
					}

					currentVast().children.push(indentSection.leave)
				}
			}

			function sectionMark(name, data) {
				var o = {
					enter: {
						notDom: true,
						name: name,
						type: 'enter',
						data: data
					},
					leave: {
						notDom: true,
						name: name,
						type: 'leave',
						data: data
					}
				}
				return o
			}
		}
	})(self);

	;(function(self) {

		self.vastToDom = vastToDom

		function vastToDom(vast) {
			if (!vast) debugger
			if (vast.notDom) return

			var e = document.createElement(vast.name)
			if (vast._class) {
				e.setAttribute('class', vast._class)
			}
			if (vast.text) {
				e.textContent = vast.text
			}
			else if (vast.children && vast.children.length > 0) {
				for (var i = 0, len = vast.children.length; i < len; ++i) {
					var childDom = vastToDom(vast.children[i])
					if (childDom) e.appendChild(childDom)
				}
			}
			return e
		}

	})(self);

})(window);