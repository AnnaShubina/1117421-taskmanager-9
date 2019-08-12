import {getMenuTemplate} from './components/main-menu.js';
import {getSearchTemplate} from './components/search.js';
import {getFilterTemplate} from './components/filter.js';
import {getTasksContainerTemplate} from './components/tasks-container.js';
import {getSortingTemplate} from './components/sorting.js';
import {getTaskFormTemplate} from './components/task-form.js';
import {getTaskTemplate} from './components/task.js';
import {getLoadMoreTemplate} from './components/load-more.js';

const render = (wrap, template, place) => {
  wrap.insertAdjacentHTML(place, template);
};

const main = document.querySelector(`.main`);
const menu = document.querySelector(`.main__control`);

render(menu, getMenuTemplate(), `beforeEnd`);
render(main, getSearchTemplate(), `beforeEnd`);
render(main, getFilterTemplate(), `beforeEnd`);
render(main, getTasksContainerTemplate(), `beforeEnd`);

const tasksContainer = document.querySelector(`.board`);
const tasksList = document.querySelector(`.board__tasks`);

render(tasksList, getSortingTemplate(), `beforeBegin`);
render(tasksList, getTaskFormTemplate(), `beforeEnd`);
for (let i = 0; i < 3; i++) {
  render(tasksList, getTaskTemplate(), `beforeEnd`);
}
render(tasksContainer, getLoadMoreTemplate(), `beforeEnd`);
