// Trello Sort Cards by Steps - https://github.com/Q42/TrelloScrum
// Organizes cards by steps
//
// Original:
// Hadrien BRUNAUD <https://github.com/sewnboy>


/**
 * Declaration of main variables
 */

// Lang
langSortLabel = 'Trier par étapes';
langSortShortLabel = 'étapes';

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

 // Sections
sections = {
  sectionTodo: 'todo',
  sectionDoing: 'doing',
  sectionDone: 'done'
}

// Boards
boardsArray = [];
boardsContainer = '.window-module';
boardTitle = '.window-module-title h3 a';

// Cards
cardsArray = {
  todo: [],
  doing: [],
  done: []
};
cardsContainer = '.js-list';
cardContainer = '.list-card-container';
cardContentContainer = '.js-card';
cardListParentContainer = '.list-card-position';
cardListContainer = 'strong';


/**
 * Creates an array containing every board info
 */
var createBoardsArray = function () {
  $(mainContainer + ' ' + boardsContainer).each( function () {
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
  insertContent();
}


/**
 * Creates an array containing every card info of a board
 * @param board - the parent board containing the cards
 */
var createCardsArray = function (board) {
  board.find($(cardsContainer)).each( function () {
    $(this).find($(cardContainer)).each( function() {
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
      if (cardList.indexOf(sections.sectionTodo) >= 0) {
        // console.log('TODO');
        cardsArray.todo.push(card);
      }
      else if (cardList.indexOf(sections.sectionDoing) >= 0) {
        // console.log('DOING');
        cardsArray.doing.push(card);
      }
      else if (cardList.indexOf(sections.sectionDone) >= 0) {
        // console.log('DONE');
        cardsArray.done.push(card);
      }
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
  if (cardsArray.done.length != 0) {
    insertSection(sections.sectionDone);
    $.each (cardsArray.done, function () {
      insertCard($(this)[0], sections.sectionDone);
    });
  }
  if (cardsArray.doing.length != 0) {
    insertSection(sections.sectionDoing);
    $.each (cardsArray.doing, function () {
      insertCard($(this)[0], sections.sectionDoing);
    });
  }
  if (cardsArray.todo.length != 0) {
    insertSection(sections.sectionTodo);
    $.each (cardsArray.todo, function () {
      insertCard($(this)[0], sections.sectionTodo);
    });
  }
}


/**
 * Inserts a section in the main container
 * @param section - the section to insert
 */
var insertSection = function (section) {
  var content = 
    '<div class="' + boardsContainer.replace('.', '') + ' ' + section + '">'+
      '<div class="window-module-title">' +
        '<span class="window-module-title-icon icon-lg icon-board"></span>' +
        '<h3><a href="#">' + section.toUpperCase() + '</a></h3>' +
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
  $(mainContainer + ' ' + boardsContainer + '.' + section + ' .js-list').append(content);
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
    if ($(sortPopoverContainer).hasClass('is-shown')) {
      insertSortOption(function () {
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
 * Main Listener
 */
if ($('body').has('.js-member-cards.active')) {
  bindSortDisplay();
}


/**
 * Listener : When the option is clicked
 */
$('body').on('click', '.js-sort-by-step', function () {
  boardsArray = [];
  cardsArray = {
    todo: [],
    doing: [],
    done: []
  };
  createBoardsArray();
  $(sortPopoverContainer).removeClass('is-shown');
  $(sortPopoverContentContainer).empty();
  $(sortMainContainer + ' ' + sortLabelContainer).html(langSortShortLabel);
});