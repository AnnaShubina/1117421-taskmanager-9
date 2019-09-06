import Menu from './components/main-menu.js';
import Search from './components/search.js';
import Filter from './components/filter.js';
import Statistics from './components/statistics.js';
import filterMocks from './mocks/filter.js';
import taskMocks from './mocks/task.js';
import BoardController from './controllers/board.js';
import SearchController from './controllers/search.js';
import {Position, render} from './utils.js';

const mainContainer = document.querySelector(`.main`);
const menuContainer = document.querySelector(`.main__control`);
const menu = new Menu();
const search = new Search();
const filter = new Filter(filterMocks);
const statistics = new Statistics();
const onDataChange = (tasks) => {
  taskMocks = tasks;
};

render(menuContainer, menu.getElement(), Position.BEFOREEND);
render(mainContainer, search.getElement(), Position.BEFOREEND);
render(mainContainer, filter.getElement(), Position.BEFOREEND);
render(mainContainer, statistics.getElement(), Position.BEFOREEND);

const boardController = new BoardController(mainContainer, onDataChange);
const onSearchBackButtonClick = () => {
  statistics.getElement().classList.add(`visually-hidden`);
  searchController.hide();
  boardController.show(taskMocks);
};
const searchController = new SearchController(mainContainer, search, onSearchBackButtonClick);
statistics.getElement().classList.add(`visually-hidden`);
boardController.show(taskMocks);

menu.getElement().addEventListener(`change`, (evt) => {
  evt.preventDefault();

  if (evt.target.tagName !== `INPUT`) {
    return;
  }

  const tasksId = `control__task`;
  const statisticId = `control__statistic`;
  const newTaskId = `control__new-task`;

  switch (evt.target.id) {
    case tasksId:
      statistics.getElement().classList.add(`visually-hidden`);
      boardController.show();
      searchController.hide();
      break;
    case statisticId:
      boardController.hide();
      searchController.hide();
      statistics.getElement().classList.remove(`visually-hidden`);
      break;
    case newTaskId:
      boardController.createTask();
      boardController.show();
      menu.getElement().querySelector(`#${newTaskId}`).checked = true;
      break;
  }
});

search.getElement().addEventListener(`click`, () => {
  statistics.getElement().classList.add(`visually-hidden`);
  boardController.hide();
  searchController.show(taskMocks);
});
