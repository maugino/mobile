;
define('utils/SectionsTitleFactory', ['i18n!nls/nav'], (function (nav) {

	var init = function ($main, $forgotPassword, $courses, $reports, $settings) {

		$main.attr('data-title', nav.welcomeSection);
		$forgotPassword.attr('data-title', nav.forgotPwdSection);
		$courses.attr('data-title', nav.coursesSection);
		$reports.attr('data-title', nav.reportsSection);
		// disabled until version 2
		// $settings.attr('data-title', nav.settingsSections);

	};

	return{

		init: init

	}

}))