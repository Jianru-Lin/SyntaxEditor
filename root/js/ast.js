;(function() {

	function AST() {

	}

	AST.prototype.isBasic = function(target) {
		return target.type === 'Literal' || target.type === 'Identifier'
	}

	self.ast = new AST()
	
})(window);