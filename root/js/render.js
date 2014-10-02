;(function(self) {

	self.render = render
	self = {
		walkAST: self.walkAST
	}

	function render(ast) {
		var vast = self.astToVast(ast)
		var dom = self.vastToDom(vast)
		dom = self.pretty(dom)
		return dom
	}

	;(function(self) {

		var enterStack
		var leaveStack
		var _currentEnter
		var _currentLeave

		self.pushEnterLeave = pushEnterLeave
		self.popEnterLeave = popEnterLeave
		self.clearEnterLeave = clearEnterLeave
		self.currentEnter = currentEnter
		self.currentLeave = currentLeave

		function pushEnterLeave(_enter, _leave) {
			enterStack.push(_enter)
			_currentEnter = _enter
			leaveStack.push(_leave)
			_currentLeave = _leave
		}

		function popEnterLeave() {
			enterStack.pop()
			_currentEnter = enterStack[enterStack.length - 1]
			leaveStack.pop()
			_currentLeave = leaveStack[leaveStack.length - 1]
		}

		function clearEnterLeave() {
			enterStack = []
			leaveStack = []
			_currentEnter = undefined
			_currentLeave = undefined
		}

		function currentEnter(target) {
			_currentEnter(target)
		}

		function currentLeave() {
			_currentLeave()
		}

	})(self);

	;(function(self) {

		var vastStack

		self.astToVast = astToVast

		var enterExMap = {
				'Program': undefined,
				'EmptyStatement': undefined,
				'BlockStatement': undefined,
				'ExpressionStatement': undefined,
				'IfStatement': undefined,
				'LabeledStatement': undefined,
				'BreakStatement': undefined,
				'ContinueStatement': undefined,
				'WithStatement': undefined,
				'SwitchStatement': undefined,
				'ReturnStatement': undefined,
				'ThrowStatement': undefined,
				'TryStatement': undefined,
				'WhileStatement': undefined,
				'DoWhileStatement': undefined,
				'ForStatement': undefined,
				'ForInStatement': undefined,
				'ForOfStatement': undefined,
				'LetStatement': undefined,
				'DebuggerStatement': undefined,
				'FunctionDeclaration': undefined,
				'VariableDeclaration': undefined,
				'VariableDeclarator': undefined,
				'ThisExpression': undefined,
				'ArrayExpression': undefined,
				'ObjectExpression': undefined,
				'Property': undefined,
				'FunctionExpression': undefined,
				'ArrowExpression': undefined,
				'SequenceExpression': undefined,
				'UnaryExpression': undefined,
				'BinaryExpression': undefined,
				'AssignmentExpression': undefined,
				'UpdateExpression': undefined,
				'LogicalExpression': undefined,
				'ConditionalExpression': undefined,
				'NewExpression': undefined,
				'CallExpression': undefined,
				'MemberExpression': undefined,
				'YieldExpression': undefined,
				'ComprehensionExpression': undefined,
				'GeneratorExpression': undefined,
				'GraphExpression': undefined,
				'GraphIndexExpression': undefined,
				'LetExpression': undefined,
				'ObjectPattern': undefined,
				'ArrayPattern': undefined,
				'SwitchCase': undefined,
				'CatchClause': undefined,
				'ComprehensionBlock': undefined,
				'Identifier': undefined,
				'Literal': undefined
		}

		function astToVast(ast) {
			
			var root = {
				name: 'div',
				_class: 'VAST',
				children: []
			}

			vastStack = [root]

			//self.clearEnterLeave()
			//pushEnterLeaveForNode(ast)
			self.walkAST(ast, enter, enterProp, leaveProp, leave)
			//popEnterLeaveForNode(ast)

			return root

			function enter(node) {
				var v = {
					name: 'span',
					_class: node.type,
					children: []
				}

				pushVast(v)

				if (/Statement$/.test(node.type)) {
					v._class += ' Statement'
				}
				else if (/Expression$/.test(node.type)) {
					v._class += ' Expression'
				}

				if (node.type === 'Identifier') {
					v.text = node.name
				}
				else if (node.type === 'Literal') {
					if (node.raw[0] === '"' || node.raw[0] === "'") {
						v.text = "'" + node.value + "'"
					}
					else {
						v.text = node.value + ''
					}
				}
				else if (node.type === 'UnaryExpression' || node.type === 'UpdateExpression') {
					if (node.prefix) {
						v._class += ' prefix'
					}
					else {
						v._class += ' postfix'
					}
				}
				else if (node.type === 'MemberExpression') {
					if (node.computed) {
						v._class += ' computed'
					}
				}

				// var key = node.type
				// var enterEx = enterExMap[key]
				// if (enterEx) {
				// 	enterEx(node)
				// }
			}

			function leave(node) {
				popVast()
			}

			function enterProp(node, propName, prop) {
				var v = {
					name: 'span',
					_class: propName,
					children: []
				}

				pushVast(v)

				if (propName === 'operator') {
					v.text = prop
				}

			}

			function leaveProp(node, propName, prop) {
				popVast()
			}
		}

		// function pushEnterLeaveForNode(node) {
		// 	if (!node) return
		// 	var enterLeave = enterLeaveMap[node.type]
		// 	self.pushEnterLeave(enterLeave[0], enterLeave[1])
		// }

		// function popEnterLeaveForNode(node) {
		// 	if (!node) return
		// 	self.popEnterLeave()
		// }

		// function whatShouldIDo() {
		// 	throw new Error('What should I do? ' + target.name)
		// }

		function pushVast(e) {
			if (vastStack.length > 0) {
				var parent = vastStack[vastStack.length - 1]
				parent.children.push(e)
			}
			vastStack.push(e)
		}

		function popVast() {
			vastStack.pop()
		}

	})(self);

	;(function(self){

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

	;(function(self) {

		self.pretty = pretty

		function pretty(dom) {
			var _
			var $dom = $(dom)

			$(dom).find('.Statement:not(.BlockStatement)').after($('<br>'))

			// Program
			// EmptyStatement
			// BlockStatement
			// ExpressionStatement
			// IfStatement
			// LabeledStatement
			// Statement
			// ContinueStatement
			// WithStatement
			// SwitchStatement
			// ReturnStatement
			// ThrowStatement
			// TryStatement

			$(dom)
				.find('.TryStatement')
				.each(function() {
					$(this)
						.children('.block')
							.before(pre('try'))
							.addClass('block')
							.children()
								.addClass('indent')

					var handlers = $(this).children('.handlers')
					var catchClauses = handlers.children()
					if (catchClauses.length) {
						catchClauses.children('.param').before(pre('catch ( ')).after(pre(' )'))
						catchClauses.children('.body').addClass('block').children().addClass('indent')
					}

					var finalizer = $(this).children('.finalizer')
					var finalizerChildren = finalizer.children()
					if (finalizerChildren.length) {
						finalizer.before($(pre('finally')).addClass('block'))
						finalizerChildren.addClass('indent')
					}
				})

			// $(dom).find('.TryStatement > .block').before(pre('try'))
			// $(dom).find('.TryStatement > .block').addClass('block')
			// $(dom).find('.TryStatement > .block > *').addClass('indent')
			// $(dom)
			// 	.find('.CatchClause > .param')
			// 	.before(pre('catch ( '))
			// 	.after(pre(' )'))
			// $(dom).find('.CatchClause > .body').addClass('block')
			// $(dom).find('.CatchClause > .body > *').addClass('indent')
			// $(dom).find('.TryStatement > .finalizer').before($(pre('finally')).addClass('block'))
			// $(dom).find('.TryStatement > .finalizer').addClass('block')
			// $(dom).find('.TryStatement > .finalizer > *').addClass('indent')

			// WhileStatement

			$(dom).find('.WhileStatement > .test').before(pre('while ( ')).after(pre(' )'))
			$(dom).find('.WhileStatement > .body').addClass('block')
			$(dom).find('.WhileStatement > .body > *').addClass('indent')

			// DoWhileStatement

			$(dom).find('.DoWhileStatement > .body').before(pre('do'))
			$(dom).find('.DoWhileStatement > .body').addClass('block')
			$(dom).find('.DoWhileStatement > .test').before(pre('while ( ')).after(pre(' )'))
			$(dom).find('.DoWhileStatement > .body > *').addClass('indent')

			// ForStatement

			$(dom).find('.ForStatement > .init').before(pre('for ( '))
			$(dom).find('.ForStatement > .update').after(pre(')'))
			$(dom).find('.ForStatement > .init').after(pre('; '))
			$(dom).find('.ForStatement > .test').after(pre('; '))
			$(dom).find('.ForStatement > .init > *:first-child').parent().after(pre(' '))
			$(dom).find('.ForStatement > .test > *:first-child').parent().after(pre(' '))
			$(dom).find('.ForStatement > .update > *:first-child').parent().after(pre(' '))
			$(dom).find('.ForStatement > .body').addClass('block')
			$(dom).find('.ForStatement > .body > *').addClass('indent')
			
			// ForInStatement

			$(dom).find('.ForInStatement > .left').before(pre('for ( '))
			$(dom).find('.ForInStatement > .left').after(pre(' in '))
			$(dom).find('.ForInStatement > .right').after(pre(' )'))
			$(dom).find('.ForInStatement > .body').addClass('block')
			$(dom).find('.ForInStatement > .body > *').addClass('indent')

			// ForOfStatement (TODO)

			// LetStatement (TODO)

			// DebuggerStatement

			$(dom).find('.DebuggerStatement').text('debugger')

			// FunctionDeclaration

			$(dom).find('.FunctionDeclaration > .body').addClass('block')
			$(dom).find('.FunctionDeclaration > .id').before(pre('function '))
			$(dom).find('.FunctionDeclaration > .id > *:first-child').after(space())
			_ = $(dom).find('.FunctionDeclaration > .params')
			_.before(pre('('))
			_.after(pre(')'))
			$(dom)
				.find('.FunctionDeclaration > .params > *:not(:last-child)')
				.each(function() {
					$(this).after(comma(), sp())
				})
			$(dom).find('.FunctionDeclaration > .body > *').addClass('indent')
			
			// VariableDeclaration
			// VariableDeclarator

			$(dom).find('.VariableDeclaration > .declarations').before(pre('var '))
			$(dom)
				.find('.VariableDeclaration > .declarations > .VariableDeclarator > .init > *:first-child')
				.parent()
				.before(pre(' = '))

			// ThisExpression

			$(dom).find('.ThisExpression').text('this')

			// ArrayExpression

			$(dom).find('.ArrayExpression > .elements').before('[').after(']')
			$(dom)
				.find('.ArrayExpression > .elements > *:not(:last-child)')
				.each(function() {
					$(this).after(comma(), sp())
				})
			$(dom).find('.ArrayExpression > .elements > *:first-child').before(space())
			$(dom).find('.ArrayExpression > .elements > *:last-child').after(space())

			// ObjectExpression
			// Property

			$(dom).find('.ObjectExpression > .properties').before(pre('{')).after('}')
			$(dom)
				.find('.ObjectExpression > .properties > *:not(:last-child)')
				.each(function() {
					$(this).after(comma(), sp())
				})
			$(dom).find('.Property > .key').after(colon())
			$(dom).find('.ObjectExpression > .properties > *:first-child').before(space())
			$(dom).find('.ObjectExpression > .properties > *:last-child').after(space())


			// FunctionExpression

			var functionExpressions = find('.FunctionExpression')
			find('.FunctionExpression > .id').before(keywork('function'), sp())
			find('.FunctionExpression > .id:not(:empty)').after(sp())
			find('.FunctionExpression > .params').before(lbracket()).after(rbracket())
			find('.FunctionExpression > .params > *:first-child').before(sp())
			find('.FunctionExpression > .params > *:not(:last-child)').after(comma(), sp())
			find('.FunctionExpression > .params > *:last-child').after(sp())
			find('.FunctionExpression > .body > .BlockStatement > .body').before(sp(), lbrace()).after(rbrace())
			find('.FunctionExpression > .body > .BlockStatement > .body:not(:empty)').before(br())

			// ArrowExpression

			// UnaryExpression

			$(dom).find('.UnaryExpression > .operator').after(space())

			// SequenceExpression

			$(dom)
				.find('.SequenceExpression > .expressions > *:not(:last-child)')
				.each(function(i) {
					$(this).after(comma(), sp())
				})

			// BinaryExpression

			_ = $(dom).find('.BinaryExpression > .operator')
			_.after(space())
			_.before(space())

			// AssignmentExpression

			_ = $(dom).find('.AssignmentExpression > .operator')
			_.after(space())
			_.before(space())

			// UpdateExpression

			_ = $(dom).find('.UpdateExpression.prefix > .operator')
			_.after(space())
			_ = $(dom).find('.UpdateExpression.postfix > .operator')
			_.before(space())

			// LogicalExpression

			_ = $(dom).find('.LogicalExpression > .operator')
			_.after(space())
			_.before(space())

			// ConditionalExpression

			$(dom).find('.ConditionalExpression > .test').after(question())
			$(dom).find('.ConditionalExpression > .consequent').after(colon())

			// NewExpression

			$(dom).find('.NewExpression > .callee').before(_new())
			_ = $(dom).find('.NewExpression > .arguments')
			_.before(pre(' ('))
			_.find('*:not(:last-child)').each(function() {
				$(this).after(pre(', '))
			})
			_.find('*:first-child').before(pre(' '))
			_.find('*:last-child').after(pre(' '))
			_.after(pre(')'))

			// CallExpression

			// MemberExpression

			$(dom).find('.MemberExpression:not(.computed) > .object').after(pre('.'))
			_ = $(dom).find('.MemberExpression.computed > .property')
			_.before(pre('['))
			_.after(pre(']'))

			// YieldExpression

			// ComprehensionExpression

			// GeneratorExpression

			// GraphExpression

			// GraphIndexExpression

			// LetExpression

			// ObjectPattern

			// ArrayPattern

			// SwitchCase

			// CatchClause

			// ComprehensionBlock

			// Identifier

			// Literal

			return dom;

			function find(selector) {
				return $dom.find(selector).not('.x')
			}
		}

		function keywork(text) {
			return span(text).addClass('keywork')
		}

		function lbrace() {
			return span('{')
		}

		function rbrace() {
			return span('}')
		}

		function lbracket() {
			return span('(')
		}

		function rbracket() {
			return span(')')
		}

		function comma() {
			return span(',')
		}

		function span(text) {
			return $('<span>').text(text).addClass('x')
		}

		function sp(n) {
			n = n === undefined ? 1 : n
			var t = ''
			while (n-- > 0) {
				t += ' '
			}
			return pre(t)
		}

		function pre(text) {
			var e = document.createElement('span')
			e.textContent = text
			return $(e).addClass('pre').addClass('x')
		}

		function br() {
			return $('<br>')
		}

		function space() {
			return pre(' ')
		}

		function question() {
			return pre(' ? ')
		}

		function colon() {
			return pre(' : ')
		}

		function _new() {
			return pre('new ')
		}

	})(self);

})(window);