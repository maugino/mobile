define('utils/InfoProvider', ['appframework', 'appframeworkui', 'core/Constants', 'model/DataProvider', 'i18n!nls/miscellaneous'], (function ($, $ui, Constants, dataProvider, miscellaneous) {

	var events = {API_INFO_DATA_READY: 'infoDataReady', API_INFO_DATA_ERROR: 'infoDataError'};

	var logoURL, dataCache;
	var that = this;

	var onInfoReady = function (data) {

		dataCache = JSON.parse(data);

		if (dataCache.success === true) {

			logoURL = dataCache.logo;
			dataReady();

		}

	};

	var onInfoError = function (xhr, error) {

		navigator.notification.confirm(miscellaneous.genericMissingInfoError,
			function (buttonIndex) {

				if (buttonIndex === 1) {

					dataReady(true);

				} else {

					$ui.hideMask();
					$ui.loadContent('main', false, false, Constants.PANELS_DIRECTION);

				}

			}, miscellaneous.confirmTitle,
			[miscellaneous.ok, miscellaneous.cancel]);
	};

	var getInfo = function (url, rootURL) {

		if (dataCache && logoURL) {

			dataReady(false);

		} else {

			var paramsForProxy = JSON.stringify({'details': {'action': 'getlmsinfo', 'url': url}}),
				params = JSON.stringify({'url': url});

			dataProvider.fetchData('public/getlmsinfo', params, onInfoReady, onInfoError, rootURL);

		}

	};

	var dataReady = function (error) {

		var eventType;

		if (error) {

			eventType = events.API_INFO_DATA_ERROR;

		} else {

			eventType = events.API_INFO_DATA_READY;

		}


		var event = new CustomEvent(eventType, {bubbles: true, cancelable: true});
		that.dispatchEvent(event);

	};

	return {

		getInfo: getInfo,
		logoURL: function () {
			return logoURL;
		},
		events: events

	}

}));