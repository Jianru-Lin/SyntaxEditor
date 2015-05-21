window.config = {
	_value: {
		version: '1.0',
		fileList: []
	},
	load: function() {
		if (localStorage) {
			var v = localStorage.getItem('config')
			if (v) {
				v = JSON.parse(v)
				this._value = v
			}
		}
	},
	save: function() {
		if (localStorage) {
			localStorage.setItem('config', JSON.stringify(this._value))
		}
	},
	getFileList: function() {
		return this._value.fileList
	},
	setFileList: function(v) {
		if (!Array.isArray(v)) {
			throw new Error('invalid argument')
		}
		this._value.fileList = v
		this.save()
	}
}

config.load()