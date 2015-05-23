window.config = {
	_value: {
		version: '1.0',
		defaultFile: {
			name: 'default.js',
			content: ''
		},
		lastOpenedFile: undefined
	},
	get defaultFile() {
		return this._value.defaultFile
	},
	get lastOpenedFile() {
		return this._value.lastOpenedFile
	},
	set lastOpenedFile(v) {
		this._value.lastOpenedFile = v
		this.save()
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
	}
}

config.load()