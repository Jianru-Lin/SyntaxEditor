;(function (self){
	$(function() {
		$('#ast-view').on('mouseenter mouseleave', 'span', function() {
			var id = $(this).attr('id')
			var metaData = metaDataTable[id]
			if (metaData) {
				var targetId = metaData.foldingTo
				$(this).toggleClass('highlight')
				$('#' + targetId).toggleClass('highlight')
			}
		})
	})
})(window);