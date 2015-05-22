function LocalFilePanel() {
	var vm = new Vue({
		el: document.querySelector('.local-file-panel'),
		data: {
			files: []
		},
		methods: {
			onAdd: function(e) {
				var fileName = window.prompt('file name').trim()
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
				var newFileName = window.prompt('new file name').trim()
				instance.rename(currentFileName, newFileName)
			}
		}
	})

	var instance = {
		exists: function(fileName) {
			var fileNameLo = fileName.toLowerCase()
			return vm.files.some(function(item) {
				return item.toLowerCase() === fileNameLo
			})
		},
		indexOf: function(fileName) {
			var fileNameLo = fileName.toLowerCase()
			for (var i = 0, len = vm.files.length; i < len; ++i) {
				if (fileNameLo === vm.files[i].toLowerCase()) {
					return i
				}
			}
			return -1
		},
		rename: function(currentFileName, newFileName) {
			var pos = this.indexOf(currentFileName)
			if (pos === -1) return false
			if (newFileName.toLowerCase() !== currentFileName.toLowerCase() &&
				this.exists(newFileName)) {
				return false
			}
			var files = vm.files.slice()
			files[pos] = newFileName
			vm.files = files
		},
		add: function(fileName) {
			if (this.exists(fileName)) return false
			vm.files.push(fileName)
		},
		remove: function(fileName) {
			var fileNameLo = fileName.toLowerCase()
			vm.files = vm.files.filter(function(item) {
				return item.toLowerCase() !== fileNameLo
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