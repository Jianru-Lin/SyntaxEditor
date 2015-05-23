window.vfs = {
	metaData: {
		version: '1.0',
		fileMapTable: {},
		fileList: []
	},
	listenerList: [],
	createFile: function(name, content) {
		if (!this.isValidFileName(name)) {
			throw new Error('invalid arguments')
		}

		if (typeof content !== 'string' && content !== undefined && content !== null) {
			throw new Error('invalid arguments')
		}

		if (this.existsFile(name)) {
			return false
		}
		else {
			var fileMapItem = {
				name: name,
				lowLevelName: 'vfs://' + name
			}
			this.metaData.fileMapTable[name] = fileMapItem
			this.metaData.fileList.push(name)
			localStorage.setItem(fileMapItem.lowLevelName, content || '')
			this._saveMetaData()

			// fire event
			this._fireEvent('create', name)
			return true
		}
	},
	updateFileName: function(currentName, newName) {

	},
	deleteFile: function(name) {
		if (!this.isValidFileName(name)) {
			throw new Error('invalid arguments')
		}

		var self = this

		this.metaData.fileList = this.metaData.fileList.filter(function(item) {
			return self.isSameFileName(item, name)
		})
	},
	retriveFileContent: function(name) {

	},
	updateFileContent: function(name, newContent) {

	},
	existsFile: function(name) {
		if (!this.isValidFileName(name)) {
			throw new Error('invalid arguments')
		}

		var nameLo = name.toLowerCase()
		return this.metaData.fileList.some(function(item) {
			return item.toLowerCase() === nameLo
		})
	},
	retriveFileList: function() {
		return this.metaData.fileList.slice()
	},
	// # cb(e)
	// e {type: 'create|update|delete', fileName: ''}
	addEventListener: function(cb) {
		if (typeof cb !== 'function') {
			throw new Error('invalid arguments')
		}

		var existsAlready = this.listenerList.some(function(item) {
			item === cb
		})

		if (existsAlready) {
			return
		}

		this.listenerList.push(cb)
	},
	removeEventListener: function(cb) {
		if (typeof cb !== 'function') {
			throw new Error('invalid arguments')
		}

		this.listenerList = this.listenerList.filter(function(item) {
			item !== cb
		})
	},
	isValidFileName: function(name) {
		return typeof name === 'string' && name !== ''
	},
	isSameFileName: function(nameA, nameB) {
		if (!this.isValidFileName(nameA) || !this.isValidFileName(nameB)) {
			throw new Error('invalid arguments')
		}

		return nameA.toLowerCase() === nameB.toLowerCase()
	},
	_loadMetaData: function() {
		var metaData = localStorage.getItem('vfs')
		if (metaData) {
			this.metaData = JSON.parse(metaData)
		}
	},
	_saveMetaData: function() {
		localStorage.setItem('vfs', JSON.stringify(this.metaData))
	},
	_fireEvent: function(type, fileName) {
		this.listenerList.forEach(function(listener) {
			var e = {
				type: type,
				fileName: fileName
			}
			listener(e)
		})
	}
}

vfs._loadMetaData()