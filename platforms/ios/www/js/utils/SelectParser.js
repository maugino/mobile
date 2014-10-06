;
define('utils/SelectParser', [], (function () {

	var $select, $options;

	var init = function (select) {

		$select = select;
		$options = $select.find('option');

	};

	var update = function (val) {

		var options, swapIndex, value, html;

		options = new Array($options.length);
		html = '';

		$.each($options, function (currentIndex, currentValue) {

			options[currentIndex] = currentValue;

			if ($(currentValue).attr('value') === val) {

				swapIndex = currentIndex;

			}

		});

		if (swapIndex) {

			value = options.splice(swapIndex, 1);
			options.unshift(value[0]);

			$select.empty();

			for (var i = 0, tot = options.length; i < tot; i++) {

				html += options[i].outerHTML;

			}

			$select.html(html);

		}

	};

	return {

		init: init,
		update: update

	}

}));