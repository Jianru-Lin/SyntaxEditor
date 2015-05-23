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
				var fileName = e.targetVM.file.name
				if (!confirm('delete ' + fileName + '?')) return
				vfs.deleteFile(fileName)
			},
			onRename: function(e) {
				var currentFileName = e.targetVM.file.name
				var newFileName = window.prompt('new file name') || ''
				newFileName = newFileName.trim()
				if (!newFileName) return
				vfs.updateFileName(currentFileName, newFileName)
			},
			onOpen: function(e) {
				var file = e.targetVM.file
				instance.open(file.name)
			}
		}
	})

	vfs.addEventListener(function(e) {
		if (e.type === 'create') {
			vm.files.push({
				name: e.name,
				open: false
			})
			// open on create
			instance.open(e.name)
		}
		else if (e.type === 'update' && e.what === 'name') {
			vm.files = vm.files.map(function(item) {
				if (vfs.isSameName(e.oldValue, item.name)) {
					item.name = e.newValue
					return item
				}
				else {
					return item
				}
			})
		}
		else if (e.type === 'delete') {
			vm.files = vm.files.filter(function(item) {
				return !vfs.isSameName(item.name, e.name)
			})
		}
	})

	var instance = {
		add: function(fileName, content) {
			vfs.createFile(fileName, content)
		},
		open: function(fileName) {
			vm.files.forEach(function(item) {
				item.open = vfs.isSameName(item.name, fileName)
			})
			this.onOpen(fileName)
		},
		onOpen: function(fileName) {
			// implement by outside
		},
		count: function() {
			return vm.files.length
		}
	}

	// load file list
	vm.files = vfs.retriveFileList().map(function(fileName) {
		return {
			name: fileName,
			open: false
		}
	})

	return instance
}