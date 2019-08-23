import Menu from './components/main-menu.js';
import Search from './components/search.js';
import Filter from './components/filter.js';
import filterMocks from './mocks/filter.js';
import taskMocks from './mocks/task.js';
import BoardController from './controllers/board.js';
import {Position, render} from './utils.js';

const mainContainer = document.querySelector(`.main`);
const menuContainer = document.querySelector(`.main__control`);
const menu = new Menu();
const search = new Search();
const filter = new Filter(filterMocks);
const boardController = new BoardController(mainContainer, taskMocks);

render(menuContainer, menu.getElement(), Position.BEFOREEND);
render(mainContainer, search.getElement(), Position.BEFOREEND);
render(mainContainer, filter.getElement(), Position.BEFOREEND);

boardController.init();
