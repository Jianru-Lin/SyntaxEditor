function LocalFilePanel() {
	var vm = new Vue({
		el: document.querySelector('.local-file-panel'),
		data: {
			files: []
		},
		methods: {
			onAdd: function(e) {
				var fileName = window.prompt('file name')
				if (!fileName) return
				instance.add(fileName)
			},
			onRemove: function(e) {
				var fileName = e.targetVM.file
				if (!confirm('delete ' + fileName + '?')) return
				instance.remove(fileName)
			},
			onRename: function(e) {
				var currentFileName = e.targetVM.file
				var newFileName = window.prompt('new file name')
				instance.rename(currentFileName, newFileName)
			}
		}
	})

	var instance = {
		rename: function(currentFileName, newFileName) {
			var pos = vm.files.indexOf(currentFileName)
			if (pos === -1) return
			var files = vm.files.slice()
			files[pos] = newFileName
			vm.files = files
		},
		add: function(fileName) {
			vm.files.push(fileName)
		},
		remove: function(fileName) {
			vm.files = vm.files.filter(function(item) {
				return item !== fileName
			})
		},
		count: function() {
			return vm.files.length
		},
		clear: function() {
			vm.files = []
		}
	}

	// load file list
	loadFileList()

	return instance

	function loadFileList() {
		var fileList = config.getFileList()
		if (fileList && fileList.length > 0) {
			vm.files = fileList
		}
	}
}