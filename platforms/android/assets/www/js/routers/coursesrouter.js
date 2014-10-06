;
define('routers/coursesrouter', ['core/Constants', 'appframework'], (function (Constants, $) {

	var that = this;
	var history = [];

	var loadView = function (view, module, data, reverse) {

		var direction;

		$('#' + view).bind('loadpanel', function (e) {

			require([module], function (module) {

				module.init(data || null);

			});

			$('#' + view).unbind('loadpanel', arguments.callee);

		});

		reverse ? direction = Constants.DETAILS_HIDE_DIRECTION : Constants.DETAILS_REVEALS_DIRECTION;

		$.ui.loadContent(view, false, false, direction);

	};

	var onOpenDetails = function (evt) {

		evt.stopImmediatePropagation();

		var view = evt.detail.view,
			module = evt.detail.module,
			data = evt.detail.data;

		if (evt.detail.push) {

			history.push({view: view, module: module, data: data});

		}

		loadView(view, module, data);

	};

	var doGoBack = function () {

		var details = history.pop();
		loadView(details.view, details.module, details.data, true);

	};

	var doDispose = function () {

		that.removeEventListener(Constants.DETAIL_VIEW_EVENT, onOpenDetails);

	};

	var doInit = function () {

		that.addEventListener(Constants.DETAIL_VIEW_EVENT, onOpenDetails);

	};

	return {

		init: doInit,
		dispose: doDispose,
		goBack: doGoBack

	}

}));