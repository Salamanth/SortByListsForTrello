// Trello Sort Cards by Steps - https://github.com/Q42/TrelloScrum
// Organizes cards by steps
//
// Original:
// Hadrien BRUNAUD <https://github.com/sewnboy>


/**
 * Declaration of main variables
 */

_domSteps = [];
_storageSteps = [];
_defaultSteps = ['Todo', 'Doing', 'Done'];

steps = [];

/**
 * Creates a new step
 */
var createStep = function () {
	$('.table-steps').append('<tr><td><span class="regex-slash">/</span><input type="text" class="step-regex" placeholder="Step Regex" value="Step" ><span class="regex-slash">/</span></td><td><a href="" class="delete-step">Delete</a></td></tr>');
	saveSteps();
}


/**
 * Deletes a step
 * @param step - the step to delete
 */
var deleteStep = function (step) {
	step.closest('tr').remove();
	saveSteps();
}


/**
 * Save steps in Chrome storage
 */
var saveSteps = function () {
	$('.table-steps tr').each( function () {
		var regex = $(this).find('.step-regex').val();
		_domSteps.push(regex);
	});
	chrome.storage.sync.set({steps: _domSteps}, function () {
		console.log('Steps Saved');
		_domSteps = [];
	});
}


/**
 * Get saved steps in Chrome storage
 */
var setSteps = function (callback) {
	chrome.storage.sync.get( function (data) {
		_storageSteps = data.steps;
		// Default steps
		if (typeof _storageSteps === 'undefined' || _storageSteps.length == 0) {
			_storageSteps = _defaultSteps;
		}
		callback();
	});
}


/**
 * Inits saved steps in the main Array
 */
var initSteps = function () {
	console.log(_storageSteps);
	$.each(_storageSteps, function (index, value) {
		$('.table-steps').append('<tr><td><span class="regex-slash">/</span><input type="text" class="step-regex" placeholder="Step Regex" value="' + value + '" ><span class="regex-slash">/</span></td><td><a href="" class="delete-step">Delete</a></td></tr>');
	});
}


/**
 * Main Init
 */
$(document).ready( function () {
	setSteps( function () {
		initSteps();
	});
});


/**
 * Listener : When a step is added
 */
$('body').on('click', '.add-step', function (e) {
	e.preventDefault();
	createStep();
});


/**
 * Listener : When a step is deleted
 */
$('body').on('click', '.delete-step', function (e) {
	e.preventDefault();
	deleteStep($(this));
});


/**
 * Listener : When a step is edited
 */
$('body').on('keyup', '.step-regex', function (e) {
	saveSteps();
});


/**
 * Listener : When a step is edited
 */
$('body').on('click', '.get-steps', function (e) {
	setSteps();
});

