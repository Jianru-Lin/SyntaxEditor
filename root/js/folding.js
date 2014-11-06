;(function (self){
	self.folding = {
		init: function() {
			$('#ast-view span').off('click')
			$('#ast-view span').on('click', function() {
				alert('click')
			})
		}
	}
})(window);