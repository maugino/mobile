;define('model/State', function () {

	function State(data, template, controller, viewPath) {

		this.data = data;
		this.template = template || controller.toLowerCase() + '-tpl.html';
		this.controller = controller;
		this.viewPath = viewPath;

	}

	return State;

});