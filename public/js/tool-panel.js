function ToolPanel() {

	var instance = {
		onFormat: function() {

		},
		onFoldAll: function() {

		},
		onUnFoldAll: function() {

		},
		onRun: function() {

		}
	}

	$('#format').click(function() {
		instance.onFormat()
	})

	$('#fold-all').click(function() {
		instance.onFoldAll()
	})

	$('#unfold-all').click(function() {
		instance.onUnFoldAll()
	})

	$('#run').click(function() {
		instance.onRun()
	})

	return instance
}