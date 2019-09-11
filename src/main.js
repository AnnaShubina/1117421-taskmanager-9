import Menu from './components/main-menu.js';
import Search from './components/search.js';
import Statistics from './components/statistics.js';
import taskMocks from './mocks/task.js';
import BoardController from './controllers/board.js';
import SearchController from './controllers/search.js';
import FilterController from './controllers/filter.js';
import {Position, render} from './utils.js';

const mainContainer = document.querySelector(`.main`);
const menuContainer = document.querySelector(`.main__control`);
const menu = new Menu();
const search = new Search();
const statistics = new Statistics();
const onFilterSwitch = (tasks) => {
  boardController.onFilterSwitch(tasks);
};
const onFilterChange = (tasks) => {
  filterController.filterChange(tasks);
};

render(menuContainer, menu.getElement(), Position.BEFOREEND);
render(mainContainer, search.getElement(), Position.BEFOREEND);

const filterController = new FilterController(search.getElement(), taskMocks, onFilterSwitch);

render(mainContainer, statistics.getElement(), Position.BEFOREEND);

const boardController = new BoardController(mainContainer, onFilterChange);
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
      menu.getElement().querySelector(`#${tasksId}`).checked = true;
      break;
  }
});

search.getElement().addEventListener(`click`, () => {
  statistics.getElement().classList.add(`visually-hidden`);
  boardController.hide();
  searchController.show(taskMocks);
});
