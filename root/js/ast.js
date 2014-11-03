;(function() {

	var n = 0

	function AST() {

	}

	AST.prototype.isBasic = function(target) {
		return target.type === 'Literal' || target.type === 'Identifier'
	}

	AST.prototype.priority = function(target) {
		switch (toECMA262_5E(target.type)) {
			// PrimaryExpression
			case 'ThisExpression':
			case 'ArrayExpression':
			case 'ObjectExpression':
			case 'Identifier':
			case 'Literal':
			case 'FunctionExpression':
				return 1;
			case 'MemberExpression':
				return 2;
			case 'NewExpression':
			case 'CallExpression':
				return 3;
			case 'PostfixExpression':
				return 4;
			case 'UnaryExpression':
				return 5;
			case 'MultiplicativeExpression':
				return 6;
			case 'AdditiveExpression':
				return 7;
			case 'ShiftExpression':
				return 8;
			case 'RelationalExpression':
				return 9;
			case 'EqualityExpression':
				return 10;
			case 'BitwiseANDExpression':
				return 11;
			case 'BitwiseXORExpression':
				return 12;
			case 'BitwiseORExpression':
				return 13;
			case 'LogicalANDExpression':
				return 14;
			case 'LogicalORExpression':
				return 15;
			case 'ConditionalExpression':
				return 16;
			case 'AssignmentExpression':
				return 17;
			case 'SequenceExpression':
				return 18;
			default:
				throw new Error('I dont\'t know how to determine the priority for: ' + target.type)
		}

		function toECMA262_5E (target) {
			switch (target.type) {
				case 'ThisExpression':
				case 'ArrayExpression':
				case 'ObjectExpression':
				case 'Identifier':
				case 'Literal':
					return 'PrimaryExpression'
				case 'UpdateExpression':
					if (target.prefix) {
						return 'UnaryExpression'
					}
					else {
						return 'PostfixExpression'
					}
				case 'BinaryExpression':
					switch (target.operator) {
						case '*':
						case '/':
						case '%':
							return 'MultiplicativeExpression'
						case '+':
						case '-':
							return 'AdditiveExpression'
						case '<<':
						case '>>':
						case '>>>':
							return 'ShiftExpression'
						case '<':
						case '>':
						case '<=':
						case '>=':
						case 'instanceof':
						case 'in':
							return 'RelationalExpression'
						case '==':
						case '!=':
						case '===':
						case '!==':
							return 'EqualityExpression'
						case '&':
							return 'BitwiseANDExpression'
						case '^':
							return 'BitwiseXORExpression'
						case '|':
							return 'BitwiseORExpression'
						default:
							throw new Error('unknown BinaryExpression operator: ' + target.operator)
					}
				case 'LogicalExpression':
					switch (target.operator) {
						case '&&':
							return 'LogicalANDExpression'
						case '||':
							return 'LogicalORExpression'
						default:
							throw new Error('unknown LogicalExpression operator: ' + target.operator)
					}
				default:
					return target.type
			}			
		}
	}

	AST.prototype.comparePriority = function(a, b) {
		var pa = this.priority(a)
		var pb = this.priority(b)
		return pa - pb
	}

	self.ast = new AST()

})(window);