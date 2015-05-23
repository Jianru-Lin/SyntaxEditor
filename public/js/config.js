window.config = {
	_value: {
		version: '1.0'
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