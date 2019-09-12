import Menu from './components/main-menu.js';
import Search from './components/search.js';
import dataTasks from './mocks/task.js';
import BoardController from './controllers/board.js';
import SearchController from './controllers/search.js';
import FilterController from './controllers/filter.js';
import StatisticsController from './controllers/statistics.js';
import {Position, render} from './utils.js';

const mainContainer = document.querySelector(`.main`);
const menuContainer = document.querySelector(`.main__control`);
const menu = new Menu();
const search = new Search();
let taskMocks = dataTasks;
const onDataChange = (tasks) => {
  taskMocks = tasks;
};
const onFilterSwitch = (tasks) => {
  boardController.onFilterSwitch(tasks);
  statisticsController.hide();
  boardController.show();
  searchController.hide();
};
const onFilterChange = (tasks) => {
  filterController.filterChange(tasks);
};

render(menuContainer, menu.getElement(), Position.BEFOREEND);
render(mainContainer, search.getElement(), Position.BEFOREEND);

const filterController = new FilterController(search.getElement(), taskMocks, onFilterSwitch);

const statisticsController = new StatisticsController(mainContainer, taskMocks);

const boardController = new BoardController(mainContainer, onFilterChange, onDataChange);
const onSearchBackButtonClick = () => {
  statisticsController.hide();
  searchController.hide();
  boardController.show(taskMocks);
};
const searchController = new SearchController(mainContainer, search, onSearchBackButtonClick);
statisticsController.hide();
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
      statisticsController.hide();
      boardController.show();
      searchController.hide();
      break;
    case statisticId:
      boardController.hide();
      searchController.hide();
      statisticsController.show(taskMocks);
      break;
    case newTaskId:
      boardController.createTask();
      boardController.show();
      statisticsController.hide();
      menu.getElement().querySelector(`#${tasksId}`).checked = true;
      break;
  }
});

search.getElement().addEventListener(`click`, () => {
  statisticsController.hide();
  boardController.hide();
  searchController.show(taskMocks);
});
