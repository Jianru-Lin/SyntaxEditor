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

		var enterLeaveMap = {
				Program: [enterProgram, leaveProgram],
				EmptyStatement: [enterEmptyStatement, leaveEmptyStatement],
				BlockStatement: [enterBlockStatement, leaveBlockStatement],
				ExpressionStatement: [enterExpressionStatement, leaveExpressionStatement],
				IfStatement: [enterIfStatement, leaveIfStatement],
				LabeledStatement: [enterLabeledStatement, leaveLabeledStatement],
				BreakStatement: [enterBreakStatement, leaveBreakStatement],
				ContinueStatement: [enterContinueStatement, leaveContinueStatement],
				WithStatement: [enterWithStatement, leaveWithStatement],
				SwitchStatement: [enterSwitchStatement, leaveSwitchStatement],
				ReturnStatement: [enterReturnStatement, leaveReturnStatement],
				ThrowStatement: [enterThrowStatement, leaveThrowStatement],
				TryStatement: [enterTryStatement, leaveTryStatement],
				WhileStatement: [enterWhileStatement, leaveWhileStatement],
				DoWhileStatement: [enterDoWhileStatement, leaveDoWhileStatement],
				ForStatement: [enterForStatement, leaveForStatement],
				ForInStatement: [enterForInStatement, leaveForInStatement],
				ForOfStatement: [enterForOfStatement, leaveForOfStatement],
				LetStatement: [enterLetStatement, leaveLetStatement],
				DebuggerStatement: [enterDebuggerStatement, leaveDebuggerStatement],
				FunctionDeclaration: [enterFunctionDeclaration, leaveFunctionDeclaration],
				VariableDeclaration: [enterVariableDeclaration, leaveVariableDeclaration],
				VariableDeclarator: [enterVariableDeclarator, leaveVariableDeclarator],
				ThisExpression: [enterThisExpression, leaveThisExpression],
				ArrayExpression: [enterArrayExpression, leaveArrayExpression],
				ObjectExpression: [enterObjectExpression, leaveObjectExpression],
				Property: [enterProperty, leaveProperty],
				FunctionExpression: [enterFunctionExpression, leaveFunctionExpression],
				ArrowExpression: [enterArrowExpression, leaveArrowExpression],
				SequenceExpression: [enterSequenceExpression, leaveSequenceExpression],
				UnaryExpression: [enterUnaryExpression, leaveUnaryExpression],
				BinaryExpression: [enterBinaryExpression, leaveBinaryExpression],
				AssignmentExpression: [enterAssignmentExpression, leaveAssignmentExpression],
				UpdateExpression: [enterUpdateExpression, leaveUpdateExpression],
				LogicalExpression: [enterLogicalExpression, leaveLogicalExpression],
				ConditionalExpression: [enterConditionalExpression, leaveConditionalExpression],
				NewExpression: [enterNewExpression, leaveNewExpression],
				CallExpression: [enterCallExpression, leaveCallExpression],
				MemberExpression: [enterMemberExpression, leaveMemberExpression],
				YieldExpression: [enterYieldExpression, leaveYieldExpression],
				ComprehensionExpression: [enterComprehensionExpression, leaveComprehensionExpression],
				GeneratorExpression: [enterGeneratorExpression, leaveGeneratorExpression],
				GraphExpression: [enterGraphExpression, leaveGraphExpression],
				GraphIndexExpression: [enterGraphIndexExpression, leaveGraphIndexExpression],
				LetExpression: [enterLetExpression, leaveLetExpression],
				ObjectPattern: [enterObjectPattern, leaveObjectPattern],
				ArrayPattern: [enterArrayPattern, leaveArrayPattern],
				SwitchCase: [enterSwitchCase, leaveSwitchCase],
				CatchClause: [enterCatchClause, leaveCatchClause],
				ComprehensionBlock: [enterComprehensionBlock, leaveComprehensionBlock],
				Identifier: [enterIdentifier, leaveIdentifier],
				Literal: [enterLiteral, leaveLiteral]
		}

		function astToVast(ast) {
			
			var root = {
				name: 'div',
				class: 'VAST',
				children: []
			}

			vastStack = [root]

			self.clearEnterLeave()
			pushEnterLeaveForNode(ast)
			self.walkAST(ast, enter, leave)
			popEnterLeaveForNode(ast)

			return root

			function enter(target) {
				self.currentEnter(target)
			}

			function leave() {
				self.currentLeave()
			}
		}

		function pushEnterLeaveForNode(node) {
			if (!node) return
			var enterLeave = enterLeaveMap[node.type]
			self.pushEnterLeave(enterLeave[0], enterLeave[1])
		}

		function popEnterLeaveForNode(node) {
			if (!node) return
			self.popEnterLeave()
		}

		function whatShouldIDo() {
			throw new Error('What should I do? ' + target.name)
		}

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

		function enterProgram(target) {
			switch (target.name) {
				case 'Program':
					pushVast({
						name: 'div',
						_class: 'Program',
						children: []
					})
					break
				case '.body':
					pushEnterLeaveForNode(target.node)
					break
				default:
					whatShouldIDo()
			}
		}

		function leaveProgram(target) {
			switch (target.name) {
				case 'Program':
					popVast()
					break
				case '.body':
					break
				default:
					whatShouldIDo()
			}
		}

		function enterEmptyStatement(target) {}

		function leaveEmptyStatement(target) {}

		function enterBlockStatement(target) {}

		function leaveBlockStatement(target) {}

		function enterExpressionStatement(target) {}

		function leaveExpressionStatement(target) {}

		function enterIfStatement(target) {}

		function leaveIfStatement(target) {}

		function enterLabeledStatement(target) {}

		function leaveLabeledStatement(target) {}

		function enterBreakStatement(target) {}

		function leaveBreakStatement(target) {}

		function enterContinueStatement(target) {}

		function leaveContinueStatement(target) {}

		function enterWithStatement(target) {}

		function leaveWithStatement(target) {}

		function enterSwitchStatement(target) {}

		function leaveSwitchStatement(target) {}

		function enterReturnStatement(target) {}

		function leaveReturnStatement(target) {}

		function enterThrowStatement(target) {}

		function leaveThrowStatement(target) {}

		function enterTryStatement(target) {}

		function leaveTryStatement(target) {}

		function enterWhileStatement(target) {}

		function leaveWhileStatement(target) {}

		function enterDoWhileStatement(target) {}

		function leaveDoWhileStatement(target) {}

		function enterForStatement(target) {}

		function leaveForStatement(target) {}

		function enterForInStatement(target) {}

		function leaveForInStatement(target) {}

		function enterForOfStatement(target) {}

		function leaveForOfStatement(target) {}

		function enterLetStatement(target) {}

		function leaveLetStatement(target) {}

		function enterDebuggerStatement(target) {}

		function leaveDebuggerStatement(target) {}

		function enterFunctionDeclaration(target) {}

		function leaveFunctionDeclaration(target) {}

		function enterVariableDeclaration(target) {}

		function leaveVariableDeclaration(target) {}

		function enterVariableDeclarator(target) {}

		function leaveVariableDeclarator(target) {}

		function enterThisExpression(target) {}

		function leaveThisExpression(target) {}

		function enterArrayExpression(target) {}

		function leaveArrayExpression(target) {}

		function enterObjectExpression(target) {}

		function leaveObjectExpression(target) {}

		function enterProperty(target) {}

		function leaveProperty(target) {}

		function enterFunctionExpression(target) {}

		function leaveFunctionExpression(target) {}

		function enterArrowExpression(target) {}

		function leaveArrowExpression(target) {}

		function enterSequenceExpression(target) {}

		function leaveSequenceExpression(target) {}

		function enterUnaryExpression(target) {}

		function leaveUnaryExpression(target) {}

		function enterBinaryExpression(target) {}

		function leaveBinaryExpression(target) {}

		function enterAssignmentExpression(target) {}

		function leaveAssignmentExpression(target) {}

		function enterUpdateExpression(target) {}

		function leaveUpdateExpression(target) {}

		function enterLogicalExpression(target) {}

		function leaveLogicalExpression(target) {}

		function enterConditionalExpression(target) {}

		function leaveConditionalExpression(target) {}

		function enterNewExpression(target) {}

		function leaveNewExpression(target) {}

		function enterCallExpression(target) {}

		function leaveCallExpression(target) {}

		function enterMemberExpression(target) {}

		function leaveMemberExpression(target) {}

		function enterYieldExpression(target) {}

		function leaveYieldExpression(target) {}

		function enterComprehensionExpression(target) {}

		function leaveComprehensionExpression(target) {}

		function enterGeneratorExpression(target) {}

		function leaveGeneratorExpression(target) {}

		function enterGraphExpression(target) {}

		function leaveGraphExpression(target) {}

		function enterGraphIndexExpression(target) {}

		function leaveGraphIndexExpression(target) {}

		function enterLetExpression(target) {}

		function leaveLetExpression(target) {}

		function enterObjectPattern(target) {}

		function leaveObjectPattern(target) {}

		function enterArrayPattern(target) {}

		function leaveArrayPattern(target) {}

		function enterSwitchCase(target) {}

		function leaveSwitchCase(target) {}

		function enterCatchClause(target) {}

		function leaveCatchClause(target) {}

		function enterComprehensionBlock(target) {}

		function leaveComprehensionBlock(target) {}

		function enterIdentifier(target) {}

		function leaveIdentifier(target) {}

		function enterLiteral(target) {}

		function leaveLiteral(target) {}


	})(self);

	;(function(self){

		self.vastToDom = vastToDom

		function vastToDom(vast) {
			var e = document.createElement(vast.name)
			if (vast._class) {
				e.setAttribute('class', vast._class)
			}
			if (vast.children) {
				for (var i = 0, len = vast.children; i < len; ++i) {
					e.appendChild(vastToDom(vast.children[i]))
				}
			}
			return e
		}

	})(self);

})(window);