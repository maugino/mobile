define('utils/CustomEventPolyfill', [], (function () {

	(function () {
		function CustomEvent(event, params) {
			params = params || { bubbles: false, cancelable: false, detail: undefined };
			var evt = document.createEvent('CustomEvent');
			evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
			return evt;
		};

		CustomEvent.prototype = window.Event.prototype;

		if (!window.CustomEvent)window.CustomEvent = CustomEvent;
	})();

}));