;(function(self) {
	'use strict'

	self.parse = parse

	function parse(text) {
		return esprima.parse(text)
	}

})(window);

;(function(self) {
	'use strict'

	self.walkAST = walkAST;

	function walkAST(ast, enterCb, enterPropCb, leavePropCb, leaveCb) {
		return walkNode(ast)

		function walkNode(node) {

			if (!node) return

			enter(node)

			switch (node.type) {
				case 'Program':
					walkProperty(node, 'body')
					break
				case 'EmptyStatement':
					break
				case 'BlockStatement':
					walkProperty(node, 'body')
					break
				case 'ExpressionStatement':
					walkProperty(node, 'expression')
					break
				case 'IfStatement':
					walkProperty(node, 'test')
					walkProperty(node, 'consequent')
					walkProperty(node, 'alternate')
					break
				case 'LabeledStatement':
					walkProperty(node, 'label')
					walkProperty(node, 'body')
					break
				case 'BreakStatement':
					walkProperty(node, 'label')
					break
				case 'ContinueStatement':
					walkProperty(node, 'label')
					break
				case 'WithStatement':
					walkProperty(node, 'object')
					walkProperty(node, 'body')
					break
				case 'SwitchStatement':
					walkProperty(node, 'discriminant')
					walkProperty(node, 'cases')
					break
				case 'ReturnStatement':
					walkProperty(node, 'argument')
					break
				case 'ThrowStatement':
					walkProperty(node, 'argument')
					break
				case 'TryStatement':
					walkProperty(node, 'block')
					walkProperty(node, 'handlers')
					walkProperty(node, 'guardedHandlers')
					walkProperty(node, 'finalizer')
					break
				case 'WhileStatement':
					walkProperty(node, 'test')
					walkProperty(node, 'body')
					break
				case 'DoWhileStatement':
					walkProperty(node, 'body')
					walkProperty(node, 'test')
					break
				case 'ForStatement':
					walkProperty(node, 'init')
					walkProperty(node, 'test')
					walkProperty(node, 'update')
					walkProperty(node, 'body')
					break
				case 'ForInStatement':
					walkProperty(node, 'left')
					walkProperty(node, 'right')
					walkProperty(node, 'body')
					break
				case 'ForOfStatement':
					walkProperty(node, 'left')
					walkProperty(node, 'right')
					walkProperty(node, 'body')
					break
				case 'LetStatement':
					walkProperty(node, 'head')
					walkProperty(node, 'body')
					break
				case 'DebuggerStatement':
					break
				case 'FunctionDeclaration':
					walkProperty(node, 'id')
					walkProperty(node, 'params')
					walkProperty(node, 'defaults')
					walkProperty(node, 'rest')
					walkProperty(node, 'body')
					break
				case 'VariableDeclaration':
					walkProperty(node, 'declarations')
					break
				case 'VariableDeclarator':
					walkProperty(node, 'id')
					walkProperty(node, 'init')
					break
				case 'ThisExpression':
					break
				case 'ArrayExpression':
					walkProperty(node, 'elements')
					break
				case 'ObjectExpression':
					walkProperty(node, 'properties')
					break
				case 'Property':
					walkProperty(node, 'key')
					walkProperty(node, 'value')
					break
				case 'FunctionExpression':
					walkProperty(node, 'id')
					walkProperty(node, 'params')
					walkProperty(node, 'defaults')
					walkProperty(node, 'rest')
					walkProperty(node, 'body')
					break
				case 'ArrowExpression':
					walkProperty(node, 'params')
					walkProperty(node, 'defaults')
					walkProperty(node, 'rest')
					walkProperty(node, 'body')
					break
				case 'SequenceExpression':
					walkProperty(node, 'expressions')
					break
				case 'UnaryExpression':
					if (node.prefix) {
						walkProperty(node, 'operator')
						walkProperty(node, 'argument')
					}
					else {
						walkProperty(node, 'argument')
						walkProperty(node, 'operator')
					}
					break
				case 'BinaryExpression':
					walkProperty(node, 'left')
					walkProperty(node, 'operator')
					walkProperty(node, 'right')
					break
				case 'AssignmentExpression':
					walkProperty(node, 'left')
					walkProperty(node, 'operator')
					walkProperty(node, 'right')
					break
				case 'UpdateExpression':
					if (node.prefix) {
						walkProperty(node, 'operator')
						walkProperty(node, 'argument')
					}
					else {
						walkProperty(node, 'argument')
						walkProperty(node, 'operator')
					}
					break
				case 'LogicalExpression':
					walkProperty(node, 'left')
					walkProperty(node, 'operator')
					walkProperty(node, 'right')
					break
				case 'ConditionalExpression':
					walkProperty(node, 'test')
					walkProperty(node, 'consequent')
					walkProperty(node, 'alternate')
					break
				case 'NewExpression':
					walkProperty(node, 'callee')
					walkProperty(node, 'arguments')
					break
				case 'CallExpression':
					walkProperty(node, 'callee')
					walkProperty(node, 'arguments')
					break
				case 'MemberExpression':
					walkProperty(node, 'object')
					walkProperty(node, 'property')
					break
				case 'YieldExpression':
					walkProperty(node, 'argument')
					break
				case 'ComprehensionExpression':
					walkProperty(node, 'body')
					walkProperty(node, 'blocks')
					walkProperty(node, 'filter')
					break
				case 'GeneratorExpression':
					walkProperty(node, 'body')
					walkProperty(node, 'blocks')
					walkProperty(node, 'filter')
					break
				case 'GraphExpression':
					walkProperty(node, 'expression')
					break
				case 'GraphIndexExpression':
					break
				case 'LetExpression':
					walkProperty(node, 'head')
					walkProperty(node, 'body')
					break
				case 'ObjectPattern':
					// check Mozilla Doc before implement this
					break
				case 'ArrayPattern':
					walkProperty(node, 'elements')
					break
				case 'SwitchCase':
					walkProperty(node, 'test')
					walkProperty(node, 'consequent')
					break
				case 'CatchClause':
					walkProperty(node, 'param')
					walkProperty(node, 'guard')
					walkProperty(node, 'body')
					break
				case 'ComprehensionBlock':
					walkProperty(node, 'left')
					walkProperty(node, 'right')
					break
				case 'Identifier':
					break
				case 'Literal':
					break
				default:
					throw new Error('Unknown Type ' + node.type)
			}

			leave(node)

		}

		function walkProperty(node, propName) {
			var prop = node[propName]
			enterPropCb(node, propName, prop)
			if (prop && typeof prop === 'object') {
				if (Array.isArray(prop)) {
					for (var i = 0, len = prop.length; i < len; ++i) {
						walkNode(prop[i])
					}
				}
				else {
					walkNode(prop)
				}
			}
			leavePropCb(node, propName, prop)
		}

		function enter(node) {
			enterCb(node)
		}

		function leave(node) {
			leaveCb(node)
		}

		function enterProp(node, propName, prop) {
			enterPropCb(node, propName, prop)
		}

		function leaveProp(node, propName, prop) {
			leavePropCb(node, propName, prop)
		}
	}

})(window);

;(function(self) {
	'use strict'

	self.analyze = analyze

	function analyze(ast) {
		ast = analyzeFunctionRelation(ast)
		ast = analyzeIdentiferRelation(ast)
		return ast
	}

	function analyzeFunctionRelation(ast) {
		return ast
	}

	function analyzeIdentiferRelation(ast) {
		return ast
	}

})(window);
