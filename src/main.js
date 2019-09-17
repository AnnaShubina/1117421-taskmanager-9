import Menu from './components/main-menu.js';
import Search from './components/search.js';
import BoardController from './controllers/board.js';
import SearchController from './controllers/search.js';
import FilterController from './controllers/filter.js';
import StatisticsController from './controllers/statistics.js';
import {Position, Action, render} from './utils.js';
import ModelTask from './model-task.js';
import API from './api.js';

const mainContainer = document.querySelector(`.main`);
const menuContainer = document.querySelector(`.main__control`);
const menu = new Menu();
const search = new Search();

render(menuContainer, menu.getElement(), Position.BEFOREEND);
render(mainContainer, search.getElement(), Position.BEFOREEND);

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/task-manager`;
const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

api.getTasks().then((tasks) => {
  const updateData = (newTasks) => {
    boardController.show(newTasks);
    filterController.filterChange(newTasks);
    searchController.setTasks(newTasks);
    statisticsController.setTasks(newTasks);
  };
  const onDataChange = (actionType, update) => {
    switch (actionType) {
      case Action.UPDATE:
        api.updateTask({
          id: update.id,
          data: ModelTask.toRAW(update)
        })
          .then(() => api.getTasks())
          .then((data) => updateData(data));
        break;
      case Action.DELETE:
        api.deleteTask({
          id: update.id
        })
          .then(() => api.getTasks())
          .then((data) => updateData(data));
        break;
      case Action.CREATE:
        api.createTask({
          task: ModelTask.toRAW(update)
        })
          .then(() => api.getTasks())
          .then((data) => updateData(data));
        break;
    }
  };
  const onFilterSwitch = (tasksItems) => {
    boardController.onFilterSwitch(tasksItems);
    statisticsController.hide();
    boardController.show();
    searchController.hide();
    menu.getElement().querySelector(`#control__task`).checked = true;
  };

  const filterController = new FilterController(search.getElement(), tasks, onFilterSwitch);
  const statisticsController = new StatisticsController(mainContainer, tasks);
  const boardController = new BoardController(mainContainer, onDataChange);
  const onSearchBackButtonClick = () => {
    statisticsController.hide();
    searchController.hide();
    boardController.show();
  };
  const searchController = new SearchController(mainContainer, search, onSearchBackButtonClick);
  searchController.setTasks(tasks);
  statisticsController.setTasks(tasks);
  statisticsController.hide();
  boardController.show(tasks);

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
        statisticsController.show();
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
    searchController.show();
  });
});
