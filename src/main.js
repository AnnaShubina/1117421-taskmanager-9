import Menu from './components/main-menu.js';
import Search from './components/search.js';
import Filter from './components/filter.js';
import Statistics from './components/statistics.js';
import filterMocks from './mocks/filter.js';
import taskMocks from './mocks/task.js';
import BoardController from './controllers/board.js';
import {Position, render} from './utils.js';

const mainContainer = document.querySelector(`.main`);
const menuContainer = document.querySelector(`.main__control`);
const menu = new Menu();
const search = new Search();
const filter = new Filter(filterMocks);
const statistics = new Statistics();

render(menuContainer, menu.getElement(), Position.BEFOREEND);
render(mainContainer, search.getElement(), Position.BEFOREEND);
render(mainContainer, filter.getElement(), Position.BEFOREEND);
render(mainContainer, statistics.getElement(), Position.BEFOREEND);

const boardController = new BoardController(mainContainer);
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
      boardController.show(taskMocks);
      break;
    case statisticId:
      boardController.hide();
      statistics.getElement().classList.remove(`visually-hidden`);
      break;
    case newTaskId:
      boardController.createTask();
      menu.getElement().querySelector(`#${newTaskId}`).checked = true;
      break;
  }
});
