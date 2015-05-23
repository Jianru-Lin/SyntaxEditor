window.vfs = {
	metaData: {
		version: '1.0',
		fileMapTable: {},
		fileList: []
	},
	listenerList: [],
	createFile: function(name, content) {
		if (!this.isValidName(name)) {
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
				fullName: 'vfs://' + name
			}
			this.metaData.fileMapTable[name] = fileMapItem
			this.metaData.fileList.push(name)
			localStorage.setItem(fileMapItem.fullName, content || '')
			this._saveMetaData()

			// fire event
			this._fireCreateEvent(name)
			return true
		}
	},
	updateFileName: function(currentName, newName) {
		if (!this.isValidName(currentName) || !this.isValidName(newName)) {
			throw new Error('invalid arguments')
		}

		if (!this.isSameName(currentName, newName) && this.existsFile(newName)) {
			// new name exists already
			return false
		}

		var self = this

		// three things to update
		// 1. key name in local storage
		// 2. item in metaData.fileList
		// 3. item in metaData.fileMapTable

		var mapItem = this.metaData.fileMapTable[currentName]
		if (!mapItem) {
			// not found
			return false
		}

		var currentFullName = mapItem.fullName

		mapItem.name = newName
		mapItem.fullName = 'vfs://' + newName
		delete this.metaData.fileMapTable[currentName]
		this.metaData.fileMapTable[newName] = mapItem
		
		// how to update local storage key? delete old item and create an new one
		var content = localStorage.getItem(currentFullName)
		localStorage.removeItem(currentFullName)
		localStorage.setItem(mapItem.fullName, content)

		// save meta data
		this._saveMetaData()

		// fire event
		this._fireUpdateNameEvent(currentName, newName)
		return true
	},
	deleteFile: function(name) {
		if (!this.isValidName(name)) {
			throw new Error('invalid arguments')
		}

		var self = this

		// three things to delete
		// 1. content in local storage
		// 2. item in metaData.fileList
		// 3. item in metaData.fileMapTable

		var mapItem = this.metaData.fileMapTable[name]
		if (!mapItem) {
			// not found
			return false
		}
		localStorage.removeItem(mapItem.fullName)
		this.metaData.fileList = this.metaData.fileList.filter(function(item) {
			return !self.isSameName(item, name)
		})
		delete this.metaData.fileMapTable[name]

		// save meta data
		this._saveMetaData()

		// fire event
		this._fireDeleteEvent(name)
		return true
	},
	retriveFileContent: function(name) {
		if (!this.isValidName(name)) {
			throw new Error('invalid arguments')
		}

		var mapItem = this.metaData.fileMapTable[name]
		if (!mapItem) {
			// not found
			throw new Error('not found')
		}

		var content = localStorage.getItem(mapItem.fullName)
		return content
	},
	updateFileContent: function(name, newContent) {
		if (!this.isValidName(name)) {
			throw new Error('invalid arguments')
		}

		if (typeof newContent !== 'string') {
			throw new Error('invalid arguments')
		}

		var mapItem = this.metaData.fileMapTable[name]
		if (!mapItem) {
			// not found
			throw new Error('not found')
		}

		localStorage.setItem(mapItem.fullName, newContent)

		// fire event
		// TODO
	},
	existsFile: function(name) {
		if (!this.isValidName(name)) {
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
	// e {type: 'create|update|delete', name: ''}
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
	isValidName: function(name) {
		return typeof name === 'string' && name !== ''
	},
	isSameName: function(nameA, nameB) {
		if (!this.isValidName(nameA) || !this.isValidName(nameB)) {
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
	_fireCreateEvent: function(name) {
		var e = {
			type: 'create',
			name: name
		}
		this.__fireEvent(e)
	},
	_fireDeleteEvent: function(name) {
		var e = {
			type: 'delete',
			name: name
		}
		this.__fireEvent(e)
	},
	_fireUpdateNameEvent: function(oldName, newName) {
		var e = {
			type: 'update',
			what: 'name',
			oldValue: oldName,
			newValue: newName
		}
		this.__fireEvent(e)
	},
	__fireEvent: function(e) {
		this.listenerList.forEach(function(listener) {
			listener(e)
		})
	}
}

vfs._loadMetaData()