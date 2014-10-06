;define('utils/ConfigurationManager', [], (function () {

	// Custom events
	var events = {DATA_READY: 'dataReady',
		ITEM_ADDED: 'itemAdded',
		CONFIGURATION_VALUE_FOUND: 'configurationValueFound',
		CONFIGURATION_VALUE_NOT_FOUND: 'configurationValueNotFound'
	};

	// Module variables
	var db, logoExists, isReady, data;
	var that = this;

	var initDatabase = function (tx) {

		// console.log('utils/ConfigurationManager => initDatbase', this, that);
		tx.executeSql("CREATE TABLE IF NOT EXISTS 'configuration' ('id' INTEGER PRIMARY KEY, 'name' TEXT, 'value' BLOB)");

	};

	var init = function () {

		// console.log('utils/ConfigurationManager => init', this, that);
		data = {};

		db = window.openDatabase('docebo', '1.0', 'docebo-lms', 1024 * 1024 * 20);
		db.transaction(initDatabase, onInitError, onInitSuccess);

	};

	var onInitError = function (err) {

		// TODO add a meaningful message for the user and log something on the device
		alert("Error processing SQL: " + err.code);

	};

	var onInitSuccess = function () {

		// console.log('utils/ConfigurationManager => onInitSuccess', this, that);

		isReady = true;

		db.transaction(function (tx) {

			tx.executeSql('SELECT * FROM configuration WHERE name = "logo"', [], onLogoResult, databaseError);

		}, databaseError);

	};

	var onLogoResult = function (tx, results) {

		// console.log('utils/ConfigurationManager => onLogoResult', this, that);

		logoExists = Boolean(results.rows.length);

		if (logoExists) {

			data['logo'] = results.rows.item(0).value;

		}

		var event = new CustomEvent(events.DATA_READY, {detail: {logoExists: logoExists}});
		that.dispatchEvent(event);

		// console.log('logoExists', logoExists, that);

	};

	var databaseError = function (transaction, error) {

		// TODO add a meaningful message for the user and log something on the device
		/*
		 console.log('SQLError.UNKNOWN_ERR', SQLError.UNKNOWN_ERR);
		 console.log('SQLError.DATABASE_ERR', SQLError.DATABASE_ERR);
		 console.log('SQLError.VERSION_ERR', SQLError.VERSION_ERR);
		 console.log('SQLError.TOO_LARGE_ERR', SQLError.TOO_LARGE_ERR);
		 console.log('SQLError.QUOTA_ERR', SQLError.QUOTA_ERR);
		 console.log('SQLError.SYNTAX_ERR', SQLError.SYNTAX_ERR);
		 console.log('SQLError.CONSTRAINT_ERR', SQLError.CONSTRAINT_ERR);
		 console.log('SQLError.TIMEOUT_ERR', SQLError.TIMEOUT_ERR);
		 */

	};

	var doLogoExists = function () {

		return logoExists;

	};

	var doIsReady = function () {

		return isReady;

	};

	var getConfigurationItem = function (name) {

		var event;

		if (data[name]) {

			event = new CustomEvent(events.CONFIGURATION_VALUE_FOUND, {detail: {value: data[name]}});
			that.dispatchEvent(event);

			return data[name];

		} else {

			db.transaction(function (tx) {

				tx.executeSql('SELECT * FROM configuration WHERE name = "' + name + '"', [], function (tx, results) {

					if (results && results.rows && results.rows.length) {

						data[name] = results.rows.item(0).value;

						event = new CustomEvent(events.CONFIGURATION_VALUE_FOUND, {detail: {value: data[name]}});

					} else {

						event = new CustomEvent(events.CONFIGURATION_VALUE_NOT_FOUND, {detail: {value: null}});

					}

					that.dispatchEvent(event);

				}, databaseError);

			}, databaseError);

		}

	};

	var saveConfigurationItem = function (name, value) {

		// console.log('utils/ConfigurationManager => saveConfigurationItem', this, that);

		db.transaction(function (tx) {

			// tx.executeSql('INSERT INTO configuration (name, value) VALUES (:name, :value)', [name, value], onConfigurationItemSaved, databaseError);
			tx.executeSql('SELECT * FROM configuration WHERE name = "' + name + '"', [], function (tx, results) {

				if (results && results.rows && results.rows.length) {

					tx.executeSql('UPDATE configuration SET value = :value WHERE name = "' + name + '"', [value], onConfigurationItemSaved, databaseError);

				} else {

					tx.executeSql('INSERT INTO configuration (name, value) VALUES (:name, :value)', [name, value], onConfigurationItemSaved, databaseError);

				}

			}, databaseError);

		}, databaseError);

		data[name] = value;
		// console.log('that', that, this);

	};

	var onConfigurationItemSaved = function (tx, results) {

		var event = new CustomEvent(events.ITEM_ADDED, {detail: {results: results}});
		that.dispatchEvent(event);

		// console.log('that', that, this);

	}

	return {

		init: init,
		logoExists: doLogoExists,
		isReady: doIsReady,
		saveConfig: saveConfigurationItem,
		configurationItem: getConfigurationItem,
		events: events

	}

}));