// Trello Sort Cards by Steps - https://github.com/Q42/TrelloScrum
// Organizes cards by steps
//
// Original:
// Hadrien BRUNAUD <https://github.com/sewnboy>


/**
 * Declaration of main variables
 */

// Lang
langSortLabel = 'Sort by tags';
langSortShortLabel = 'tags';

 // Main
mainContainer = '.js-cards-content';
mainIsLoaded = false;

// Sort
sortIsDisplayed = false;
sortMainContainer = '.js-toggle-sort';
sortLabelContainer = '.js-sort-text strong';
sortPopoverContainer = '.pop-over';
sortPopoverContentContainer = '.pop-over-content';
sortPopoverListContainer = '.pop-over-list';

// Boards
_boardsArray = [];
boardsContainer = '.window-module';
boardTitle = '.window-module-title h3 a';

// Cards
cardsArray = [];
cardsContainer = '.js-list';
cardContainer = '.list-card-container';
cardContentContainer = '.js-card';
cardListParentContainer = '.list-card-position';
cardListContainer = 'strong';
cardNewContainer = '.list-card';
cardLink = 'a.list-card-title';

// Storage
_storageSteps = [];
_defaultSteps = ['Todo', 'Doing', 'Done'];


/**
 * Creates an array containing every board info
 */
var createBoardsArray = function (callback) {
  $(mainContainer + ' ' + boardsContainer).each ( function () {
    // Saving board info
    var board = {
      title: $(this).find($(boardTitle)).html()
    };
    // Pushing board to the boards array
    boardsArray.push(board);
    // Creation of the cards array of the current board
    createCardsArray($(this));
  });
  // Inserting the cards in the DOM
  callback();
}


/**
 * Creates an array containing every card info of a board
 * @param board - the parent board containing the cards
 */
var createCardsArray = function (board) {
  board.find($(cardsContainer)).each ( function () {
    $(this).find($(cardContainer)).each ( function() {
      // console.log($(this));
      // Setting card's board name
      var cardList = $(this).find($(cardListContainer)).html().toLowerCase();
      var cardBoardContent = board.find($(boardTitle)).html();
      $(this).find($(cardListParentContainer + ' ' + cardListContainer)).html(cardBoardContent);
      // À faire : remplacer le contenu
      $(this).find($(cardListParentContainer)).text().replace('la liste', 'le tableau').replace('list', 'board');
      var cardBoard = $(this).find($(cardListParentContainer));
      // Saving card info
      var card = {
        html: $(this).find($(cardContentContainer)).html(),
        board: cardBoard.html()
      };
      // Getting the card's status (todo, doing, done)
      // And pushing card to the cards array
      $.each (_storageSteps, function (index, value) {
        // Regexp to test if the cards match the steps
        var regexp = new RegExp('(.)*' + value + '(.)*', 'i');
        var match = regexp.exec(cardList);
        if (match) {
          cardsArray[index].push(card);
        }
      });
    });
  });
}


/**
 * Inserts content in the page
 */
var insertContent = function () {
  // Emptying the main container
  $(mainContainer).empty();
  // Prepending sections & Inserting Cards
  // console.log(cardsArray);
  $.each (cardsArray, function (index, value) {
    insertSection(index, _storageSteps[index]);
    $.each (value, function () {
      insertCard($(this)[0], index);
    });
  });
}


/**
 * Inserts a section in the main container
 * @param section - the section to insert
 */
var insertSection = function (index, value) {
  var content =
    '<div class="' + boardsContainer.replace('.', '') + ' sort-cards-by-steps-' + index + '">' +
      '<div class="window-module-title">' +
        '<span class="window-module-title-icon icon-lg icon-board"></span>' +
        '<h3><a href="#">' + value.toString().toUpperCase() + '</a></h3>' +
      '</div>' +
      '<div class="u-gutter float-cards u-clearfix js-list"></div>' +
    '</div>';
  $(mainContainer).prepend(content);
}


/**
 * Inserts a card in a section
 * @param card - the card to insert
 * @param section - the section where the card will be inserted
 */
var insertCard = function (card, section) {
  var content =
    '<div class="list-card-container">' +
      card.html +
      '<p class="list-card-position quiet">' +
        card.board +
      '</div>' +
    '</div>';
  $(mainContainer + ' ' + boardsContainer + '.sort-cards-by-steps-' + section + ' .js-list').append(content);
}


/**
 * Inserts a new option in the sort menu
 */
var insertSortOption = function (callback) {
  var content =
  '<li>' +
    '<a class="highlight-icon js-sort-by-step" href="#">' +
      langSortLabel + ' <span class="icon-sm icon-check"></span>' +
    '</a>' +
  '</li>';
  $(sortPopoverContainer + ' ' + sortPopoverListContainer).append(content);
  callback();
}


/**
 * Launches insertSortOption() when the sort menu is triggered
 */
var bindSortDisplay = function () {
  if (sortIsDisplayed == false) {
    if ($(sortPopoverContainer).hasClass('is-shown') && $(sortPopoverContainer).find('.js-sort-by-board').length > 0) {
      insertSortOption( function () {
        sortIsDisplayed = true;
      });
    }
  }
  else if (! $(sortPopoverContainer).hasClass('is-shown')) {
    sortIsDisplayed = false;
  }
  setTimeout(bindSortDisplay, 250);
}


/**
 * Creates the children steps Arrays in cardsArray
 */
var initCardsArray = function (callback) {
  cardsArray = [];
  // Init of the cardsArray children
  $.each (_storageSteps, function (index, value) {
    if (typeof cardsArray[index] === 'undefined' || cardsArray[index].length == 0) {
      cardsArray[index] = [];
    }
  });
  callback();
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
 * Main Listener
 */
if ($('body').has('.js-member-cards.active')) {
  bindSortDisplay();
}


/**
 * Listener : When the option is clicked
 */
$('body').on('click', '.js-sort-by-step', function () {
  boardsArray = _boardsArray;
  setSteps( function () {
    initCardsArray( function () {
      createBoardsArray( function () {
        cardsArray.reverse();
        _storageSteps.reverse();
        insertContent();
      });
    });
  });
  $(sortPopoverContainer).removeClass('is-shown');
  $(sortPopoverContentContainer).empty();
  $(sortMainContainer + ' ' + sortLabelContainer).html(langSortShortLabel);
});


/**
 * Listener : When a card is clicked
 */
$('body').on('click', cardNewContainer, function (e) {
  var link = $(this).find(cardLink);
  document.location.href = link.attr('href');
});
