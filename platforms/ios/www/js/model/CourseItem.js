;define('model/CourseItem', [], function () {

	var STATUSES = {'attempted': 'inprogress',
		'failed': 'inprogress',
		'completed': 'completed',
		'passed': 'completed' };

	function CourseItem(id, organization, locked, title, type) {

		this.courseId = id;
		this.organization = organization;
		this.isLocked = locked;
		this.title = title;
		this.courseType = type;
		this.isFolder = type === 'folder';

	}

	CourseItem.prototype.setStatus = function (value) {

		if (value in STATUSES) {

			this.status = STATUSES[value];

		} else {

			this.status = 'notstarted';

		}

	};

	return CourseItem;

});