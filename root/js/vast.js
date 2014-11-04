;(function() {
	self.Vast = {
		isBr: function(target) {
			return !target.notDom && target.name === 'br'
		},

		div: function(_class, text) {
			return {
				name: 'div',
				_class: _class,
				text: text,
				children: []
			}
		},

		span: function(_class, text) {
			return {
				name: 'span',
				_class: _class,
				text: text,
				children: []
			}
		}
	}

})(window);