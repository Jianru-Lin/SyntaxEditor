;(function (self){
	$(function() {
		$('#ast-view').on('mouseenter mouseleave', 'span', function() {
			var id = $(this).attr('id')
			var metaData = metaDataTable[id]
			if (metaData && metaData.folding) {
				var targetId = metaData.folding.to
				$(this).toggleClass('highlight')
				if (metaData.folding.backward)
					$(this).prevUntil('#' + targetId).toggleClass('highlight')
				else
					$(this).nextUntil('#' + targetId).toggleClass('highlight')
				$('#' + targetId).toggleClass('highlight')
			}
		})
	})
})(window);