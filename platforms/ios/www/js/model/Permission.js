;define('model/Permission', function () {

	function Permission(permssion) {

		this.can = permssion.can;
		this.reason = permssion.reason;
		this.expiring = permssion.expiring_in;

	}

	return Permission;

});

/*
 "can": true,
 "reason": "course_status",
 "expiring_in": false
 */

