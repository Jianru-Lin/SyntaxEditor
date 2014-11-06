;(function() {
	self.Vast = {
		_nextId: 0,

		isBr: function(target) {
			return !target.notDom && target.name === 'br'
		},

		div: function(_class, text) {
			return {
				id: nextId(),
				name: 'div',
				_class: _class,
				text: text,
				children: []
			}
		},

		span: function(_class, text) {
			return {
				id: nextId(),
				name: 'span',
				_class: _class,
				text: text,
				children: []
			}
		},

		br: function() {
			return {
				id: nextId(),
				name: 'br'
			}
		},

		sectionMark: function(name, data) {
			var o = {
				enter: {
					notDom: true,
					name: name,
					type: 'enter',
					data: data
				},
				leave: {
					notDom: true,
					name: name,
					type: 'leave',
					data: data
				}
			}
			return o
		},

		toDom: function vastToDom(vast, gMetaData) {
			if (!vast) debugger
			if (vast.notDom) return

			var e = document.createElement(vast.name)
			if (vast.id !== undefined) {
				e.setAttribute('id', vast.id)
				// if vast dont't have an id, then we will ignore it's metaData
				if (vast.metaData) gMetaData[vast.id] = vast.metaData
			}
			if (vast._class) {
				e.setAttribute('class', vast._class)
			}
			if (vast.text) {
				e.textContent = vast.text
			}
			else if (vast.children && vast.children.length > 0) {
				for (var i = 0, len = vast.children.length; i < len; ++i) {
					var childDom = vastToDom(vast.children[i], gMetaData)
					if (childDom) e.appendChild(childDom)
				}
			}
			return e
		}

	}

	function nextId() {
		return 'vast-' + (self.Vast._nextId++)
	}

})(window);