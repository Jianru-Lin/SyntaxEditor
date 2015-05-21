function LocalFilePanel() {
	var vm = new Vue({
		el: document.querySelector('.local-file-panel'),
		data: {
			files: []
		},
		methods: {
			onAdd: function() {
				var fileName = window.prompt('file name')
				if (!fileName) return
				instance.append(fileName)
			},
			onRemove: function() {
				alert('remove')
			},
			onRename: function() {
				alert('rename')
			}
		}
	})

	var instance = {
		insertBefore: function(pos, fileName) {
			var currentFiles = vm.files
			if (pos < 0 || pos >= currentFiles.length) {
				return
			}
			else {
				var newFiles = []
				var beforeCount = pos
				while (beforeCount-- > 0) {
					newFiles.push(currentFiles.unshift())
				}
				newFiles.push(fileName)
				while (newFiles.length > 0) {
					newFiles.push(currentFiles.unshift())
				}
				vm.files = newFiles()
			}
		},
		update: function(pos, fileName) {
			if (pos >= 0 && pos < vm.files.length) {
				vm.files[pos] = fileName
			}
		},
		append: function(fileName) {
			vm.files.push(fileName)
		},
		remove: function(pos) {
			if (pos >= 0 && pos < vm.files.length) {
				for (var i = pos + 1, len = vm.files.length; i < len; ++i) {
					vm.files[i - 1] = vm.files[i]
				}
				vm.files.pop()
			}
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