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
				vfs.createFile(fileName)
			},
			onRemove: function(e) {
				var fileName = e.targetVM.file
				if (!confirm('delete ' + fileName + '?')) return
				vfs.deleteFile(fileName)
			},
			onRename: function(e) {
				var currentFileName = e.targetVM.file
				var newFileName = window.prompt('new file name').trim()
				alert('rename')
			},
			onOpen: function(e) {
				var fileName = e.targetVM.file
				instance.onOpen(fileName)
			}
		}
	})

	vfs.addEventListener(function(e) {
		if (e.type === 'create') {
			vm.files.push(e.fileName)
		}
		else if (e.type === 'update') {

		}
		else if (e.type === 'delete') {

		}
	})

	var instance = {
		onOpen: function(fileName) {
			// implement by outside
		}
	}

	// load file list
	vm.files = vfs.retriveFileList()

	return instance
}