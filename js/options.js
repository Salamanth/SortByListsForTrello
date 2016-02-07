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
	$('#steps-list').append('<li><span class="drag-handle"><i class="drag-line"></i><i class="drag-line"></i><i class="drag-line"></i></span><input type="text" class="step-regex" placeholder="Step Regex" value="Step"><i class="delete-step">&times;</i></li>');
	saveSteps();
}


/**
 * Deletes a step
 * @param step - the step to delete
 */
var deleteStep = function (step) {
	step.closest('li').remove();
	saveSteps();
}


/**
 * Save steps in Chrome storage
 */
var saveSteps = function () {
	$('#steps-list li').each( function () {
		var value = $(this).find('.step-regex').val();
		if (value.length != 0) {
			_domSteps.push(value);
		}
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
	$.each(_storageSteps, function (index, value) {
		$('#steps-list').append('<li><span class="drag-handle"><i class="drag-line"></i><i class="drag-line"></i><i class="drag-line"></i></span><input type="text" class="step-regex" placeholder="Step Regex" value="' + value + '"><i class="delete-step">&times;</i></li>');
	});
}


/**
 * Main Init
 */
$(document).ready( function () {
	// Sortable list
	var sortable = new Sortable(document.getElementById('steps-list'), {
		ghostClass: "sortable-ghost",
		chosenClass: "sortable-chosen",
		animation: 150,
		handle: ".drag-handle",
		onEnd: function (e) {
      saveSteps();
    },
	});
	// Steps Initalisation
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