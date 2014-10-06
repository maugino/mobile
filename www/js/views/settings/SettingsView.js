;
define('views/settings/SettingsView', ['appframework', 'i18n!nls/miscellaneous', 'utils/ConfigurationManager', 'controllers/PushNotificationSettings', 'core/DataManager'],
	function ($, miscellaneous, config, pushNotification, dataManager) {

		var $settingsDescription, $pushNotification,
			$pushNotificationLabel, $pushNotificationsValue;
		var that = this;

		var onPushNotification = function (evt) {

			config.saveConfig('pushnotifications', evt.target.checked);

			var event = new CustomEvent(dataManager.events.PUSH_NOTIFICATION_STATUS, {detail: {usePushNotification: evt.target.checked, settingsManager: pushNotification}});
			that.dispatchEvent(event);

		};

		var onSettingNotFound = function (evt) {

			evt.stopPropagation();

			$pushNotification.removeAttr('checked');
			$pushNotification.bind('change', onPushNotification);

		};

		var onSettingFound = function (evt) {

			evt.target.removeEventListener(evt.type, arguments.callee);

			if (evt.detail.value === 'true') {

				$pushNotification.attr('checked');

			} else {

				$pushNotification.removeAttr('checked');

			}

			$pushNotification.bind('change', onPushNotification);

		};

		var showSettingsChanged = function (status) {

			if (status === true) {

				$.ui.popup(miscellaneous.settingsChanged);

			} else {

				$.ui.popup(miscellaneous.settingsNotChanged);

			}

		};

		var showLoader = function (status) {

			if (status) {

				$.ui.showMask(miscellaneous.updatingSettings);

			} else {

				$.ui.hideMask();

			}

		};

		var init = function () {

			pushNotification.init(this);

			$settingsDescription = $('#settings > p:first-of-type');
			$pushNotification = $('#push-notification-settings input[type="checkbox"]');
			$pushNotificationLabel = $('#push-notification-settings .narrow-control');
			$pushNotificationsValue = $('#push-notification-values');

			$settingsDescription.text(miscellaneous.settingsDescription);
			$pushNotificationLabel.text(miscellaneous.pushnotification);
			$pushNotificationsValue.attr('data-on', miscellaneous.yes);
			$pushNotificationsValue.attr('data-off', miscellaneous.no);

			addEventListener(config.events.CONFIGURATION_VALUE_FOUND, onSettingFound);
			addEventListener(config.events.CONFIGURATION_VALUE_NOT_FOUND, onSettingNotFound);
			config.configurationItem('pushnotifications');

		};

		return{

			init: init,
			showSettingsChanged: showSettingsChanged,
			showLoader: showLoader

		};

	});