;define('controllers/Reports', ['model/DataProvider', 'core/DataManager', 'i18n!nls/miscellaneous', 'utils/ConfigurationManager', 'main'],

	(function (dataProvider, dataManager, miscellaneous, config, main) {

		var totalCSS, totalJS, view,
			currentCSS, currentJS,
			currentHTML, currentURL, currentProtocol,
			that = this;

		var loadData = function (v) {

			view = v;
			currentCSS = currentJS = 0;

			that.addEventListener(config.events.CONFIGURATION_VALUE_FOUND, function (evt) {

				evt.target.removeEventListener(evt.type, arguments.callee);

				currentURL = evt.detail.value + '/';
				currentProtocol = currentURL.match(/^[^:]+(?=:\/\/)/)[0];

				var user = dataManager.getUser();
				var params = JSON.stringify({'id_user': user.id, 'token': user.token, 'key': user.getUsername});

				dataProvider.fetchData('report/user', params, onReportsData, onReportsError, null, true);

			});

			config.configurationItem('defaulturl');

		};

		var parseFile = function (file) {

			if (file.indexOf('http') < 0 && file.indexOf('https') < 0) {

				file = currentProtocol + '://' + file;

			}

			return file;

		};

		var onReportsData = function (data) {

			if (data.success === true) {

				totalCSS = data.css.length;
				totalJS = data.js.length;

				currentHTML = '<body>';

				var file;

				for (var i = 0; i < totalCSS; i++) {

					file = parseFile(encodeURI(data.css[i]));
					currentHTML += '<link rel="stylesheet" type="text/css" href="' + file + '">';

				}

				for (i = 0; i < totalJS; i++) {

					file = parseFile(data.js[i]);
					currentHTML += '<script src="' + file + '"></script>';

				}

				currentHTML += data.html;
				currentHTML += '</body>';

				view.populate(currentHTML);

			} else {

				main.doLogout();
				// view.showError(miscellaneous.genericError);

			}

		};

		var onReportsError = function (xhr, error) {

			view.showError(error.message);

		};

		return{

			loadData: loadData

		};

	}));