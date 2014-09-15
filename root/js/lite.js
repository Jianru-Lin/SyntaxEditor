function div() {
	var class_ = []
	for (var i = 0; i < arguments.length; ++i) {
		class_.push(arguments[i])
	}
	return new E('div', class_)
}

function span() {
	var class_ = []
	for (var i = 0; i < arguments.length; ++i) {
		class_.push(arguments[i])
	}
	return new E('span', class_)
}

function a() {
	var class_ = []
	for (var i = 0; i < arguments.length; ++i) {
		class_.push(arguments[i])
	}
	return new E('a', class_)
}

function E(name, class_) {
	if (!Array.isArray(class_)) {
		class_ = [class_]
	}

	var e = document.createElement(name)
	class_.forEach(function(c) {
		if (c) e.classList.add(c)
	})

	this.e = e

	return this
}

E.prototype.append = function(target) {
	if (target) {
		if (target.constructor === E) {
			this.e.appendChild(target.e)
		}
		else {
			this.e.appendChild(target)
		}
	}

	return this
}

E.prototype.append_ast = function(ast) {
	var self = this
	if (ast) {
		var ast_list
		if (Array.isArray(ast)) {
			ast_list = ast
		}
		else {
			ast_list = [ast]
		}
		ast_list.forEach(function(a) {
			self.append(ast_to_dom(a))
		})
	}
	return self
}

E.prototype.text = function(t) {
	t = t || ''
	this.e.textContent = t
	return this
}

E.prototype.attr = function(name, value) {
	this.e.setAttribute(name, value)
	return this
}

E.prototype.dom = function() {
	return this.e
}