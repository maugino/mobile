;define('controllers/PushNotificationSettings', ['appframework', 'model/DataProvider'], (function ($, dataProvider) {

	var view, currentAction,
		pushNotification = window.plugins.pushNotification;

	var init = function (v) {

		view = v;

	};

	var onPushNotification = function (data) {

		view.showLoader(false);
		var currentData = JSON.parse(data);

		if (currentData.success == true) {

			view.showSettingsChanged(true);

			if (currentAction === 'register') {

				registerDevice(currentData.sender_id)

			} else {

				pushNotification.unregister(function (result) {
					console.log('unregister device:', result)
				}, errorHandler);

			}

		} else {

			view.showLoader(false);
			view.showSettingsChanged(false);

		}

	};

	var onPushNotificationError = function (xhr, error) {

		view.showSettingsChanged(false);

	};

	var changeSettings = function (status, userID, data) {

		if (status === true) {

			currentAction = 'register';

		} else {

			currentAction = 'unregister';

		}

		view.showLoader(true);

		var paramsForProxy = JSON.stringify({'details': {'action': currentAction, 'userid': userID, 'uuid': device.uuid, 'os': device.platform, 'token': data.token, 'key': data.key}}),
			params = JSON.stringify({'id_user': userID, 'device_token': device.uuid, 'os': device.platform, 'token': data.token, 'key': data.key});

		dataProvider.fetchData('pushnotification/' + currentAction, params, onPushNotification, onPushNotificationError);

	};

	var registerDevice = function (senderID) {

		if (senderID) {

			registerAndroidDevice(senderID);

		} else {

			registerIOSDevice();

		}

	};

	/* ##### Android device registration ##### */
	var registerAndroidDevice = function (senderID) {

		pushNotification.register(function (result) {
			console.log('register android device result', result);
		}, errorHandler, {'senderID': '"' + senderID + '"', 'ecb': 'onNotificationGCM'});

	};

	var onNotificationGCM = function (evt) {

		switch (evt.event) {

			case 'registered':

				if (evt.regid.length > 0) {

					// TODO send to the server the registration ID
					console.log("regID = " + evt.regid);

				}

				break;

			case 'message':
				// if this flag is set, this notification happened while we were in the foreground.
				// you might want to play a sound to get the user's attention, throw up a dialog, etc.
				if (evt.foreground) {

					// if the notification contains a soundname, play it.
					// TODO discover why the Media plugin fails with File
					// var sound = new Media('/android_asset/www/' + evt.soundname);
					// sound.play();

				} else {	// otherwise we were launched because the user touched a notification in the notification tray.

					if (evt.coldstart) {

						// $("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');

					} else {

						// $("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');

					}
				}

				break;

			case 'error':
				navigator.notification.alert(evt.message);
				break;

		}
	};

	/* ##### IOS device registration ##### */
	var registerIOSDevice = function () {

		pushNotification.register(tokenHandler, errorHandler, {'badge': 'true', 'sound': 'true', 'alert': 'true', 'ecb': 'onNotificationAPN'});	// required!

	};

	var tokenHandler = function (result) {

		// TODO send the token back to the server

	};

	var onNotificationAPN = function (evt) {

		if (evt.alert) {

			navigator.notification.alert(evt.alert);

		}

		if (evt.sound) {

			// TODO discover why the Media plugin fails with File
			// var sound = new Media(evt.sound);
			// sound.play();

		}

		if (evt.badge) {

			pushNotification.setApplicationIconBadgeNumber(function (result) {
				console.log('set badge result', result);
			}, evt.badge);

		}

	};

	var errorHandler = function (error) {

		navigator.notification.alert(error);

	};

	return {

		init: init,
		changeSettings: changeSettings

	}

}));