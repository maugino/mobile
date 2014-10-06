require.config({

	paths: {
		appframework: 'libs/appframework-2.1.0/appframework.min',
		appframeworkui: 'libs/appframework-2.1.0/ui/appframework.ui.min',
		mustache: 'libs/mustache/mustache',
		text: 'libs/require/plugins/text',
		domReady: 'libs/require/plugins/domReady',
		i18n: 'libs/require/plugins/i18n',
		css: 'libs/require/plugins/css',
		async: 'libs/require/plugins/async',
		happy: 'libs/happy/happy',
		happyValidators: 'libs/happy/happy.methods',
		base64: 'libs/base64/base64'
	},

	shim: {
		'appframework': {
			exports: '$'
		},
		'appframeworkui': {
			exports: '$.ui'
		}
	},

	config: {
		//Set the config for the i18n module ID
		i18n: {
			locale: (function () {

				var value = localStorage.getItem('userLocale') || (navigator.language || navigator.userLanguage).toLowerCase();
				value = value + '-' + value;

				return value;

			}())
		}
	},

	waitSeconds: 10

});

require(['utils/CustomEventPolyfill', 'main'], function (polyfill, main) {

	main.init();

});
