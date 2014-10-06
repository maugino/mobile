;define('model/DetailsFactory',	function () {

	"use strict";

	function DetailsFactory() {

		if (!(this instanceof DetailsFactory)) {

			throw new TypeError("DetailsFactory constructor cannot be called as a function.");

		}

	}

	/**
	 * Adding static properties is as simple as adding them directly to the constructor
	 * function directly.
	 */
	// DetailsFactory.RETIREMENT_AGE = 60;

	/**
	 * Public Static methods are defined in the same way; here's a static constructor for our Person class
	 * which also sets the person's age.
	 */
	DetailsFactory.create = function (id, courseItems) {

		var result = [];

		require([
			'model/CourseItem'
		], function (CourseItem) {

			for (var i = 0, tot = courseItems.length; i < tot; i++) {

				var item = new CourseItem(id, courseItems[i].id_org, courseItems[i].locked || false, courseItems[i].title, courseItems[i].type);

				if ('status' in courseItems[i]) {

					item.setStatus(courseItems[i].status);

				}

				result.push(item);

			}

			// {"id_org":105,"title":"This is to prevent auto-completion","type":"htmlpage","status":false,"locked":false}

		});

		return result;

	};

	DetailsFactory.prototype = {

		/**
		 * Whenever you replace an Object's Prototype, you need to repoint
		 * the base Constructor back at the original constructor Function,
		 * otherwise `instanceof` calls will fail.
		 */
		constructor: DetailsFactory,

		toString: function () {

			return Object.prototype.toString.call(this);

		}
	};

	// As mentioned up top, requireJS needs us to return a value - in this files case, we will return
	// a reference to the constructor function.
	return DetailsFactory;
});