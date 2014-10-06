;
define('views/forgotpassword/ForgotPasswordView', ['controllers/ForgotPassword', 'core/Constants', 'i18n!nls/forgot'], (function (controller, Constants, forgot) {

	var $resetURL, $email, $doRecover, $introText, $form;

	var doInit = function () {

		controller.init(this);

		$form = $('#recover-pwd-form');
		$resetURL = $('#reset-url');
		$email = $('#e-mail');
		$doRecover = $('#do-recover');
		$introText = $('#intro-text');

		$introText.text(forgot.welcome);

		$resetURL.attr('placeholder', forgot.resetURL);
		$email.attr('placeholder', forgot.email);
		$doRecover.text(forgot.reset);

		require(['libs/happy/happy'], function (happy) {

			controller.initValidation($form);

		});

		$form.bind('submit', recoverPassword);


	};

	var recoverPassword = function (evt) {

		evt.preventDefault();

		controller.recoverPassword($email.val(), rootDomain());

	};

	var rootDomain = function () {

		var url = $resetURL.val();

		if (url.indexOf(Constants.PROTCOL) < 0) {

			url = Constants.PROTCOL + url;

		}

		return url;

	}

	var doShowLoader = function (status, message) {

		if (status) {

			$.ui.showMask(message || forgot.loading);

		} else {

			$.ui.hideMask();

		}

	};

	var doShowMessage = function (msg) {

		if (msg) {

			return document.getElementById($.ui.popup(msg).id);

		}

	};

	var dispose = function () {

		$form.unbind('submit', recoverPassword);

	};

	return{

		init: doInit,
		showLoader: doShowLoader,
		showMessage: doShowMessage

	}

}));