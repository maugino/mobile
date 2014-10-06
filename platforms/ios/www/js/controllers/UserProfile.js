;define('controllers/UserProfile', ['appframework', 'model/DataProvider'], (function ($, dataProvider) {

	var $profileData = $('#main-nav > div');

	/**
	 * Print the profile data retrieved by recoverProfileData into the left menu
	 * @param data
	 */
	var onProfileData = function (data) {

		var currentData = JSON.parse(data),
			userid = currentData.userid || '',
			firstname = currentData.firstname || '',
			lastname = currentData.lastname || '',

			first_line = '',
			second_line = currentData.email || '';

		// userid
		if (firstname == '' && lastname == '') {
			first_line = userid;
		} else {
			first_line = firstname + ' ' + lastname;
		}

		$profileData.html(first_line + '<br>' + second_line);
	};

	/**
	 * Manage possible errors retrieving the profile data
	 * @param xhr
	 * @param error
	 */
	var onProfileDataError = function (xhr, error) {

		$.ui.popup(error.message);
	};

	/**
	 * Call the lms to retrieve the profile data
	 * @param id
	 * @param data
	 */
	var recoverProfileData = function (id, data) {

		var paramsForProxy = JSON.stringify({'details': {'action': 'userprofile', 'userid': id, 'token': data.token, 'key': data.key}}),
			params = JSON.stringify({'id_user': id, 'token': data.token, 'key': data.key});

		dataProvider.fetchData('user/profile', params, onProfileData, onProfileDataError);
	};

	return {
		fetch: recoverProfileData
	}

}));