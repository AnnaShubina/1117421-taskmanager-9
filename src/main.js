import {getMenuTemplate} from './components/main-menu.js';
import {getSearchTemplate} from './components/search.js';
import {getFilterTemplate} from './components/filter.js';
import {getTasksContainerTemplate} from './components/tasks-container.js';
import {getSortingTemplate} from './components/sorting.js';
import {getTaskFormTemplate} from './components/task-form.js';
import {getTaskTemplate} from './components/task.js';
import {getLoadMoreTemplate} from './components/load-more.js';
import filter from './mocks/filter.js';
import tasks from './mocks/task.js';
const TASK_COUNT = 8;
const RenderPlace = {
  BEFORBEGIN: `beforeBegin`,
  AFTERBEGIN: `afterBegin`,
  BEFOREND: `beforeEnd`,
  AFTEREND: `afterEnd`
};

const render = (wrap, template, place) => {
  wrap.insertAdjacentHTML(place, template);
};

const main = document.querySelector(`.main`);
const menu = document.querySelector(`.main__control`);

render(menu, getMenuTemplate(), RenderPlace.BEFOREND);
render(main, getSearchTemplate(), RenderPlace.BEFOREND);
render(main, getFilterTemplate(filter), RenderPlace.BEFOREND);
render(main, getTasksContainerTemplate(), RenderPlace.BEFOREND);

const tasksContainer = document.querySelector(`.board`);
const tasksList = document.querySelector(`.board__tasks`);

render(tasksList, getSortingTemplate(), RenderPlace.BEFORBEGIN);
render(tasksList, getTaskFormTemplate(), RenderPlace.BEFOREND);

const renderTasks = (taskItems, from, to) => {
  taskItems.slice(from, to).forEach((task) => render(tasksList, getTaskTemplate(task), RenderPlace.BEFOREND));
};

renderTasks(tasks, 0, TASK_COUNT - 1);

let renderedTasks = tasksList.querySelectorAll(`.card:not(.card--edit)`).length;

if (tasks.length > renderedTasks) {
  render(tasksContainer, getLoadMoreTemplate(), RenderPlace.BEFOREND);
  const loadButton = main.querySelector(`.load-more`);
  loadButton.addEventListener(`click`, () => {
    renderTasks(tasks, renderedTasks, renderedTasks + TASK_COUNT);
    renderedTasks = tasksList.querySelectorAll(`.card:not(.card--edit)`).length;
    if (renderedTasks >= tasks.length) {
      loadButton.style.opacity = `0`;
    }
  });
}
