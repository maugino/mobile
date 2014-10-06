;define('controllers/Login', ['libs/happy/happy', 'libs/happy/happy.methods', 'core/Constants',
	'utils/ConfigurationManager', 'utils/LogoLoader', 'utils/InfoProvider', 'core/DataManager', 'model/DataProvider',
	'i18n!nls/login'],
	(function (happy, validators, Constants, config, logoLoader, infoProvider, dataManager, dataProvider, loginMessages) {

		var view, currentInterval, currentUserName;
		var that = this;
		var cache = {};

		var doRecoverPassword = function (evt) {

			// console.log('should  recover password');

			var event = new CustomEvent(Constants.CHANGE_VIEW_EVENT, {detail: {view: Constants.FORGOT_PWD_VIEW, module: Constants.FORGOT_PWD_MODULE, data: null, state: null}});
			that.dispatchEvent(event);

		};

		var authenticateUser = function (username, password) {

			view.showHideLoader(true, '', function () {

				login(username, password);

			}, 'login-loader');

		};

		var handleLogin = function (username, password) {

			cache['login-loader'] = $('#login-loader');

			if (config.logoExists()) {

				cache['login-loader'].find('img').prop('src', config.configurationItem('logo'));

				view.showHideLoader(true, '', function () {

					login(username, password);

				}, 'login-loader');

			} else {

				that.addEventListener(infoProvider.events.API_INFO_DATA_ERROR, function (evt) {

					evt.target.removeEventListener(evt.type, arguments.callee);

					login(username, password);

				});

				that.addEventListener(infoProvider.events.API_INFO_DATA_READY, function (evt) {

					evt.target.removeEventListener(evt.type, arguments.callee);

					that.addEventListener(logoLoader.events.LOGO_DOWNLOAD_ERROR, function (evt) {

						evt.target.removeEventListener(evt.type, arguments.callee);
						login(username, password);

					});
					that.addEventListener(logoLoader.events.LOGO_DATA_READY, function (evt) {

						evt.target.removeEventListener(evt.type, arguments.callee);

						config.saveConfig('logo', evt.detail.logoData);
						cache['login-loader'].find('img').prop('src', config.configurationItem('logo'));

						authenticateUser(username, password);

					});

					logoLoader.load(infoProvider.logoURL());

				});

				dataProvider.setCurrentApiURL(view.getDomain(true));

				infoProvider.getInfo(view.getDomain(), view.getDomain(true));
				view.showHideLoader(true, login.loadingAssets);

			}

		};

		var onAuthenticate = function (data) {

			var currentData = JSON.parse(data);

			if (currentData.success === true) {

				require(['model/User'], function (User) {

					var currentUser = new User();

					currentUser.getUsername = currentUserName;
					currentUser.id = currentData.id_user;

					currentUser.token = currentData.token;

					var event;

					event = new CustomEvent(dataManager.events.USER_LOGGED_IN, {detail: {user: currentUser}});
					that.dispatchEvent(event);

					config.saveConfig('username', currentUserName);

					cache['login-loader'].removeAttr('src');
					view.showHideLoader(false);
					view.goNext();

					event = new CustomEvent(Constants.CHANGE_VIEW_EVENT, {detail: {view: Constants.COURSES_VIEW, module: Constants.COURSES_MODULE, data: dataManager, state: null}});
					that.dispatchEvent(event);

					require(['controllers/UserProfile'], (function (profile) {

						profile.fetch(currentUser.id, {token: currentUser.token, key: currentUserName});

					}));

				});

			} else {

				var popup = view.loginIssue(currentData.message);
				currentInterval = setInterval(function () {

					handleUnsuccessfulLogin(popup);

				}, 120);

			}

		};

		var onAuthenticateError = function (xhr, error) {

			var popup = view.loginIssue(loginMessages.remoteError);
			currentInterval = setInterval(function () {

				handleUnsuccessfulLogin(popup);

			}, 120);

		};

		var login = function (username, password) {

			currentUserName = username;

			var paramsForProxy = JSON.stringify({'details': {'action': 'authenticate', 'username': username, 'password': password }}),
				params = JSON.stringify({'username': username, 'password': password });

			dataProvider.fetchData('public/authenticate', params, onAuthenticate, onAuthenticateError, view.getDomain(true));

		};

		var elementInDocument = function (element) {

			while (element && (element == element.parentNode)) {

				if (element == document) {

					return true;

				}
			}

			return false;

		};

		var handleUnsuccessfulLogin = function (element) {

			if (!elementInDocument(element)) {

				clearInterval(currentInterval);
				view.showHideLoader(false, '', null, 'main');

			}

		};

		var initValidation = function (form) {

			form.isHappy({
				fields: {
					// reference the field you're talking about, probably by `id`
					// but you could certainly do $('[name=name]') as well.
					'#username': {

						required: true,
						message: loginMessages.userRequired //'Might we inquire your name'

					},

					'#password': {

						required: true,
						message: loginMessages.passRequired //'Please type your password!'

					},

					'#website': {

						required: true,
						message: loginMessages.domainRequired, // 'Specify the web site you would like to login',
						test: validators.website

					}
				},
				submitButton: '#do-login'
			});

		};

		var getDomainValue = function () {

			that.addEventListener(config.events.CONFIGURATION_VALUE_FOUND, function (evt) {

				evt.target.removeEventListener(evt.type, arguments.callee);

				dataProvider.setCurrentApiURL(evt.detail.value);

				var domain = evt.detail.value.replace(/.*?:\/\//g, '');
				view.getDomainItem().val(domain);

			});

			config.configurationItem('defaulturl');

		};

		var onUsername = function (evt) {

			evt.target.removeEventListener(evt.type, arguments.callee);
			view.getUsername().attr('value', evt.detail.value);

			getDomainValue();

		};

		var doChangeLanguage = function (evt) {

			var event = new CustomEvent('localePreferenceChanged', {detail: {value: evt.target.value }, bubbles: true, cancelable: true});
			that.dispatchEvent(event);

		};

		var init = function (v) {

			view = v;

			that.addEventListener(config.events.CONFIGURATION_VALUE_FOUND, onUsername);
			that.addEventListener(config.events.DATA_READY, function (evt) {

				evt.target.removeEventListener(evt.type, arguments.callee);

				var value = config.configurationItem('username');

				if (value) {

					view.getUsername().attr('value', value);
					that.removeEventListener(config.events.CONFIGURATION_VALUE_FOUND, onUsername);

				}

			});

			// Initialize the loader and configuration managers
			logoLoader.init();
			config.init();

		};

		return{

			doLogin: handleLogin,
			initValidation: initValidation,
			recoverPassword: doRecoverPassword,
			changeLanguage: doChangeLanguage,
			init: init

		}

	}));
