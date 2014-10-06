;define('controllers/Courses', ['appframework', 'core/Constants', 'model/Course', 'model/DetailsFactory', 'model/DataProvider', 'i18n!nls/courses', 'main'],

	(function ($, Constants, Course, DetailsFactory, dataProvider, courses, main) {

		var that = this;
		var view;
		var token, key, courseList;
		var courseLoaded;
		var LOCALIZED_STATUSES = [courses.notStarted, courses.inProgress, courses.completed];

		var doInit = function (v) {

			view = v;

		};

		var onGetUserCourses = function (data) {

			var currentData = JSON.parse(data);

			if (currentData.success === true) {

				prepareCoursesData(currentData);
				courseLoaded = true;
			} else {

				main.doLogout();
				// showError(data.message);
			}

		};

		var onGetUserCoursesError = function (xhr, error) {

			//view.showError(error.message);
			main.doLogout();
		};

		var doGetUserCourses = function (user) {

			token = user.token;
			key = user.getUsername;

			var params, paramsForProxy;

			if (!courseLoaded) {

				paramsForProxy = JSON.stringify({'details': {'action': 'userCourses', 'userid': user.id, 'token': token, 'key': key, 'smarthphone_only': 1}});
				params = JSON.stringify({'id_user': user.id, 'token': token, 'key': key, 'smartphone': 1});

				dataProvider.fetchData('user/userCourses', params, onGetUserCourses, onGetUserCoursesError);

				view.showLoader(true);

			}

		};

		var showError = function (message) {

			view.showLoader(false);
			view.showError(message);

		};

		var onGetCourseDetails = function (data) {

			var currentData = JSON.parse(data);

			if (currentData.success === true) {

				var event = new CustomEvent(Constants.DETAIL_VIEW_EVENT, {detail: {view: Constants.COURSES_DETAILS_VIEW, module: Constants.COURSES_DETAILS_MODULE,
					data: {token: token, key: key, objects: DetailsFactory.create(currentCourseId, currentData.objects)}, push: true}});
				that.dispatchEvent(event);

				view.showLoader(false);

			} else {

				main.doLogout();
				// showError(currentData.message);

			}

		};

		var onGetCourseDetailsError = function (xhr, error) {

			// showError(error.message);
			main.doLogout();
		};

		var doGetCourseDetails = function (id) {

			view.showLoader(true, courses.loadingCourse);
			currentCourseId = id;

			main.lastCourseId = id;
			main.lastOrganizationId = null;

			var paramsForProxy = JSON.stringify({'details': {'action': 'courseDetails', 'idCourse': id, 'token': token, 'key': key}}),
				params = JSON.stringify({ 'id_course': id, 'token': token, 'key': key});

			dataProvider.fetchData('organization/listObjects', params, onGetCourseDetails, onGetCourseDetailsError);

		};

		var prepareCoursesData = function (data) {

			var tmp = [];

			$.each(data, function (index, val) {

				try {

					var course = new Course(val.course_info);
					course.status = LOCALIZED_STATUSES[course.status];

					tmp[index] = course;

				} catch (error) {

				}

			});

			// console.log(tmp);

			courseList = tmp;
			renderData(courseList);

		};

		var updateMyCourses = function (data) {

			var user = data.getUser();
			this.getUserCourses(user);
		}

		var renderData = function (data) {

			setTimeout(function () {

				var course = data.shift();

				view.showCourse(course);

				if (data.length > 0) {

					setTimeout(arguments.callee, 50);

				} else {

					view.showLoader(false);
					view.initCoursesInteraction(true);

				}

			}, 50);

		};

		var doSearchCourses = function (str) {

			// TODO implement server side research in the next version

		};


		return {
			init: doInit,
			getUserCourses: doGetUserCourses,
			searchCourses: doSearchCourses,
			getCourseDetails: doGetCourseDetails,
			updateMyCourses: updateMyCourses
		};

	}));