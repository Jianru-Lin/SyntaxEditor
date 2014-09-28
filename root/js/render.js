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
						v.text = node.value
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

			$(dom).find('.UnaryExpression > .operator').after(space())

			_ = $(dom).find('.BinaryExpression > .operator')
			_.after(space())
			_.before(space())

			return dom;
		}

		function space() {
			var e = document.createElement('span')
			e.textContent = ' '
			return $(e).addClass('pre')
		}

	})(self);

})(window);