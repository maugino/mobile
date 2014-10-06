;
define('main', ['appframework', 'appframeworkui', 'views/login/LoginView', 'core/DataManager', 'i18n!nls/nav', 'routers/approuter', 'core/Constants', 'model/DataProvider', 'i18n!nls/miscellaneous', 'core/BackButtonManager'],

	(function ($, $ui, login, dataManager, nav, router, Constants, dataProvider, miscellaneous, BackButtonManager) {

		var isLoginDisabled;

		// These two param will store the last list of items requested, it will be then used on page refresh
		var $courseId, $organizationId;


		var onDeviceReady = function () {

			var platform, devicePlatform;

			devicePlatform = window.device.platform;

			switch (true) {

				case  devicePlatform == 'Android':
					platform = 'android';
					break;

				case  devicePlatform == 'BlackBerry':
					platform = 'bb';
					break;

				case  devicePlatform == 'WinCE':
					platform = 'win8';
					break;

				case  devicePlatform == 'iOS':
					window.device.version >= 7.0 ? platform = 'ios7' : platform = 'ios';
					break;

				default:
					platform = 'ios7';
					break;

			}

			if (platform === 'ios7') {

				setTimeout(function () {
					$('body').addClass('moveDown');
				}, 350);

			}

			$('#afui').get(0).className = platform;

			if (platform == 'android') {

				$('#afui').css('position', 'inherit');
				$('#do-login').css('box-shadow', 'inset 0 0 0 rgba(255,255,255,.4) !important');

				if (parseFloat(window.device.version) <= 4.3) {

					require(['css!../css/index-android-4.3.css'], function (css) {

						// Re-assigning the value to enforce the CSS appliance
						platform = 'android';

					});

				}

			}
			if (window.device.platform === 'iOS' && window.device.version >= 7.0) {
				require(['css!../css/ios7.css'], function (css) {

					// Re-assigning the value to enforce the CSS appliance
					platform = 'ios7';
				});
			}

			try {

				var networkState = navigator.connection.type;
				if (networkState == Connection.NONE) {

					navigator.notification.alert(miscellaneous.connectionRequired);
					isLoginDisabled = true;
					console.log(networkState);
				}

			} catch (error) {

				console.log(error);
				isLoginDisabled = true;
			}

			$(document).ready(function () {

				navigator.globalization.getPreferredLanguage(onSystemLanguage, onGlobalizationError);
				addEventListener('localePreferenceChanged', onLocalePreferenceChanged);

				require(['utils/SectionsTitleFactory'], function (factory) {

					factory.init($('#main'), $('#forgot-pwd'), $('#courses'), $('#reports'), $('#settings'));
					launchUI();
				});
			});
		};

		var launchUI = function () {

			$ui.splitview = false;

			$ui.launch();
			$ui.showBackButton = false;

			// Avoid a common issue on Android
			$.isFocused_ = true;

			$ui.disableSideMenu();
			$ui.toggleNavMenu();

			$('#courses-link').text(nav.courses);

			$('#reports-link').text(nav.reports);
			$('#reports').bind('loadpanel', loadReportsModule);

			// disabled until version 2
			// $('#settings-link').text(nav.settings);
			// $('#settings').bind('loadpanel', loadSettingsModule);

			$('#logout-link').text(nav.logout).bind('touchend', doLogout);
		};

		var loadSettingsModule = function (evt) {

			require(['views/settings/SettingsView'], function (settings) {

				settings.init();

			});

		};

		var loadReportsModule = function (evt) {

			require(['views/reports/ReportsView'], function (reports) {

				reports.init();

			});

		};

		var doLogout = function (evt) {

			if (evt != undefined) {
				evt.preventDefault();
				evt.stopPropagation();
			}

			// hide back button if currently shown
			BackButtonManager.disableBackButton();

			$.ui.showMask(miscellaneous.loggingout);

			var user = dataManager.getUser();

			var paramsForProxy = JSON.stringify({
					'details': {
						'action': 'logout',
						'id_user': user.id,
						'key': user.getUsername,
						'token': user.token
					}
				}),
				params = JSON.stringify({'id_user': user.id, 'token': user.token, 'key': user.getUsername});

			dataProvider.fetchData('user/profile', params, onUserLogout, onUserLogoutError);
		};

		var onUserLogout = function (data) {

			var currentData = JSON.parse(data);

			//With false we have to do the same
			// if (currentData.success === true) {}

			$.ui.hideMask();
			$('#menubadge').css('visibility', 'hidden');
			$.ui.loadContent('main', false, false, Constants.PANELS_DIRECTION);
		}

		var onUserLogoutError = function (xhr, error) {

			$.ui.hideMask();
			$.ui.popup(currentData.message);
		};

		var onLocalePreferenceChanged = function (evt) {

			localStorage.setItem('userLocale', evt.detail.value.toLocaleLowerCase());
			location.reload();
		};

		var onSystemLanguage = function (locale) {

			// console.log('onPreferredLanguage', locale.value);

			dataManager.init();
			router.init();

			login.init(localStorage.getItem('userLocale') || locale.value, isLoginDisabled);
		};

		var onGlobalizationError = function (error) {

			navigator.notification.alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n', null);
		};

		var init = function () {

			// console.log($);
			document.addEventListener('deviceready', onDeviceReady, false);
		};

		return {
			init: init,
			doLogout: doLogout
		};

	})

);
