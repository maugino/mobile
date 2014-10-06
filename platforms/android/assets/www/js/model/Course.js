;define('model/Course', ['model/Permission'], function (Permission) {

	function Course(info) {

		this.id = info.course_id;
		this.name = info.course_name;
		this.description = info.course_description;
		this.permission = new Permission(info.can_enter);


		this.link = info.course_link;
		this.thumb = 'http:' + encodeURI(info.course_thumbnail);
		this.status = info.courseuser_status;

		this.lang = 'IT';

	}

	return Course;

});

/*

 "course_info": {

 "course_id": "16",
 "course_name": "Articulate presenter testing Scorm 1.2 - Scorm 2004",
 "course_description": "<p>Articulate Presenter '13<\/p>",
 "can_enter": {

 "can": true,
 "reason": "course_status",
 "expiring_in": false

 },

 "course_link": "http:\/\/release61.docebo.info\/doceboLms\/index.php?modname=course&amp;op=aula&amp;idCourse=16",
 "course_thumbnail": "http:\/\/release61.docebo.info\/templates\/standard\/\/images\/course\/course_nologo.png",
 "courseuser_status": "1"

 }

 course_id  -  13
 2014-02-15 22:12:57.177 LmsClient[10404:18e03] course_name  -  Articulate storyline testing Scorm 1.2 - Scorm 2004
 2014-02-15 22:12:57.177 LmsClient[10404:18e03] course_description  -  <p>Storyline</p>
 2014-02-15 22:12:57.178 LmsClient[10404:18e03] can_enter  -  [object Object]
 2014-02-15 22:12:57.178 LmsClient[10404:18e03] course_link  -  http://release61.docebo.info/doceboLms/index.php?modname=course&amp;op=aula&amp;idCourse=13
 2014-02-15 22:12:57.178 LmsClient[10404:18e03] course_thumbnail  -  http://release61.docebo.info/templates/standard//images/course/course_nologo.png
 2014-02-15 22:12:57.178 LmsClient[10404:18e03] courseuser_status  -  1



 */