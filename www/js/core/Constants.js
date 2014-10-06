define('core/Constants', [], (function () {

	return {

		// URLs and Configuration constants
		PROTCOL: 'http://',
		API_FILE: 'api_light.php',
		API_URL: 'http://www.gnstudio.com/demos/docebo/api_light.php',
		PANELS_DIRECTION: 'up',
		DETAILS_REVEALS_DIRECTION: 'right',
		DETAILS_HIDE_DIRECTION: 'left',
		DETAILS_SHOW_FOLDER: 'down',

		// App Views and Modules
		FORGOT_PWD_MODULE: 'views/forgotpassword/ForgotPasswordView',
		FORGOT_PWD_VIEW: 'forgot-pwd',

		COURSES_MODULE: 'views/courses/CoursesView',
		COURSES_VIEW: 'courses',

		COURSES_DETAILS_MODULE: 'views/courses/CourseDetailsView',
		COURSES_DETAILS_VIEW: 'course-details',

		// Common events
		CHANGE_VIEW_EVENT: 'changeViewEvent',
		DETAIL_VIEW_EVENT: 'changeDetailViewEvent'

	}

}));