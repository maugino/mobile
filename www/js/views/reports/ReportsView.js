;
define('views/reports/ReportsView', ['appframework', 'controllers/Reports', 'i18n!nls/miscellaneous'],
	(function ($, reports, miscellaneous) {

		var content;

		var init = function () {

			if (!content)content = document.getElementById('reports-content');

			content.contentWindow.document.open('text/html', 'replace');
			content.contentWindow.document.write('');
			content.contentWindow.document.close();

			showLoader(true);
			reports.loadData(this);

		};

		var populate = function (value) {

			content.contentWindow.document.open('text/html', 'replace');
			content.contentWindow.document.write(value);
			content.contentWindow.document.close();

			showLoader(false);

		};

		var showLoader = function (status) {

			if (status) {

				$.ui.showMask(miscellaneous.loadingData);

			} else {

				$.ui.hideMask();

			}

		};

		var showError = function (message) {

			showLoader(false);
			$.ui.popup(message);

		};

		return{

			init: init,
			populate: populate,
			showError: showError

		};

	}));