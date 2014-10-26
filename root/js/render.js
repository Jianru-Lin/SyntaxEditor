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
			return execRuleTable(ast)
		}

		function execRuleTable(ast) {

			var astStack = [ast]

			var vastStack = [div('vast')]

			var ruleTable = {
				'Program': [recursive('body')],
					
				'EmptyStatement': undefined,
					
				'BlockStatement': [recursive('body')],
					
				'ExpressionStatement': [recursive('expression')],
					
				'IfStatement': [recursive('test'), recursive('consequent'), recursive('alternate')],
					
				'LabeledStatement': [recursive('label'), recursive('body')],
											
				'ContinueStatement': keyword('continue'),
					
				'WithStatement': [recursive('object'), recursive('body')],
					
				'SwitchStatement': [recursive('discriminant'), recursive('cases')],
					
				'ReturnStatement': [recursive('argument')],
					
				'ThrowStatement': [recursive('argument')],
					
				'TryStatement': [recursive('block'), recursive('handlers'), recursive('guardedHandlers'), recursive('finalizer')],
					
				'WhileStatement': [recursive('test'), recursive('body')],
					
				'DoWhileStatement': [recursive('body'), recursive('test')],
					
				'ForStatement': [recursive('init'), recursive('test'), recursive('update'), recursive('body')],
					
				'ForInStatement': [recursive('left'), recursive('right'), recursive('body')],
					
				'ForOfStatement': [recursive('left'), recursive('right'), recursive('body')],
					
				'LetStatement': [recursive('head'), recursive('body')],
					
				'DebuggerStatement': keyword('debugger'),
					
				'FunctionDeclaration': [recursive('id'), recursive('params'), recursive('defaults'), recursive('rest'), recursive('body')],
					
				'VariableDeclaration': [keyword('var'), recursive('declarations')],
					
				'VariableDeclarator': function (ast) {
					return ast.init ? [recursive('id'), operator('='), recursive('init')] : [recursive('id')]
				},
					
				'ThisExpression': keyword('this'),
					
				'ArrayExpression': [recursive('elements')],
					
				'ObjectExpression': [recursive('properties')],
					
				'Property': [recursive('key'), recursive('value')],
					
				'FunctionExpression': [recursive('id'), recursive('params'), recursive('defaults'), recursive('rest'), recursive('body')],
					
				'ArrowExpression': [recursive('params'), recursive('defaults'), recursive('rest'), recursive('body')],
					
				'SequenceExpression': [recursive('expressions')],
					
				'UnaryExpression': function(node) {
					if (node.prefix) {
						return [recursive('operator'), recursive('argument')]
					}
					else {
						return [recursive('argument'), recursive('operator')]
					}
				},
					
				'BinaryExpression': [recursive('left'), recursive('operator'), recursive('right')],
					
				'AssignmentExpression': [recursive('left'), recursive('operator'), recursive('right')],
					
				'UpdateExpression': function(node) {
					if (node.prefix) {
						return [recursive('operator'), recursive('argument')]
					}
					else {
						return [recursive('argument'), recursive('operator')]
					}
				},
					
				'LogicalExpression': [recursive('left'), recursive('operator'), recursive('right')],
					
				'ConditionalExpression': [recursive('test'), recursive('consequent'), recursive('alternate')],
					
				'NewExpression': [recursive('callee'), recursive('arguments')],
					
				'CallExpression': [recursive('callee'), recursive('arguments')],
					
				'MemberExpression': [recursive('object'), recursive('property')],
					
				'YieldExpression': [recursive('argument')],
					
				'ComprehensionExpression': [recursive('body'), recursive('blocks'), recursive('filter')],
					
				'GeneratorExpression': [recursive('body'), recursive('blocks'), recursive('filter')],
					
				'GraphExpression': [recursive('expression')],
					
				'GraphIndexExpression': undefined,
					
				'LetExpression': [recursive('head'), recursive('body')],
					
				'ObjectPattern': undefined, // check Mozilla Doc before implement this
					
				'ArrayPattern': [recursive('elements')],
					
				'SwitchCase': [recursive('test'), recursive('consequent')],
					
				'CatchClause': [recursive('param'), recursive('guard'), recursive('body')],
					
				'ComprehensionBlock': [recursive('left'), recursive('right')],
					
				'Identifier': function(astNode, parentVast) {
					var vast = {
						name: 'span',
						_class: 'Identifier',
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
								_class: 'Literal String',
								text: raw.length < 3 ? '' : "'" + raw.substring(1, text.length - 1) + "'"
							}
							break
						case 'boolean':
							var vast = {
								name: 'span',
								_class: 'Literal Boolean',
								text: raw
							}
							break
						case 'number':
							var vast = {
								name: 'span',
								_class: 'Literal Number',
								text: raw
							}
							break
						default:
							throw new Error('unsupported type of Literal: ' + typeof value)
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

			function recursive(prop) {
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
								subAst.forEach(into)
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
					currentVast().children.push(span('Keyword', text))
				}
			}

			function operator(text) {
				return function () {
					currentVast().children.push(span('Operator', text))
				}
			}
		}
	})(self);

	;(function(self) {

		self.vastToDom = vastToDom

		function vastToDom(vast) {
			var e = document.createElement(vast.name)
			if (vast._class) {
				e.setAttribute('class', vast._class)
			}
			if (vast.text) {
				e.textContent = vast.text
			}
			else if (vast.children && vast.children.length > 0) {
				for (var i = 0, len = vast.children.length; i < len; ++i) {
					e.appendChild(vastToDom(vast.children[i]))
				}
			}
			return e
		}

	})(self);

})(window);