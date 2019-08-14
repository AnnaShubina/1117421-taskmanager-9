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

const render = (wrap, template, place) => {
  wrap.insertAdjacentHTML(place, template);
};

const main = document.querySelector(`.main`);
const menu = document.querySelector(`.main__control`);

render(menu, getMenuTemplate(), `beforeEnd`);
render(main, getSearchTemplate(), `beforeEnd`);
render(main, getFilterTemplate(filter), `beforeEnd`);
render(main, getTasksContainerTemplate(), `beforeEnd`);

const tasksContainer = document.querySelector(`.board`);
const tasksList = document.querySelector(`.board__tasks`);

render(tasksList, getSortingTemplate(), `beforeBegin`);


const renderTasksListRange = (list, from, to) => {
  if (list.length <= to) {
    to = list.length;
  }
  for (let i = from; i < to; i++) {
    if (i === 0) {
      render(tasksList, getTaskFormTemplate(list[i]), `beforeEnd`);
    } else {
      render(tasksList, getTaskTemplate(list[i]), `beforeEnd`);
    }
  }
};
const TASK_COUNT = 8;

renderTasksListRange(tasks, 0, TASK_COUNT);

if (tasks.length > TASK_COUNT) {
  render(tasksContainer, getLoadMoreTemplate(), `beforeEnd`);
  const loadButton = main.querySelector(`.load-more`);
  loadButton.addEventListener(`click`, () => {
    renderTasksListRange(tasks, TASK_COUNT, TASK_COUNT * 2);
    let tasksCount = tasksList.querySelectorAll(`.card`).length;
    if (tasksCount >= tasks.length) {
      loadButton.style.opacity = `0`;
    }
  });
}
