import Menu from './components/main-menu.js';
import Search from './components/search.js';
import Filter from './components/filter.js';
import TasksContainer from './components/tasks-container.js';
import Sorting from './components/sorting.js';
import TaskForm from './components/task-form.js';
import Task from './components/task.js';
import LoadMore from './components/load-more.js';
import filterMocks from './mocks/filter.js';
import taskMocks from './mocks/task.js';
import {Position, render} from './utils.js';
const TASK_COUNT = 8;
const isTasksExist = taskMocks.length && !taskMocks.filter(({isArchive}) => isArchive).length;

const mainContainer = document.querySelector(`.main`);
const menuContainer = document.querySelector(`.main__control`);
const menu = new Menu();
const search = new Search();
const filter = new Filter(filterMocks);
const board = new TasksContainer();
const sorting = new Sorting();
const loadBtn = new LoadMore();

render(menuContainer, menu.getElement(), Position.BEFOREEND);
render(mainContainer, search.getElement(), Position.BEFOREEND);
render(mainContainer, filter.getElement(), Position.BEFOREEND);
render(mainContainer, board.getElement(), Position.BEFOREEND);

const tasksContainer = document.querySelector(`.board__tasks`);

const renderTask = (taskMock) => {
  const task = new Task(taskMock);
  const taskEdit = new TaskForm(taskMock);

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      tasksContainer.replaceChild(task.getElement(), taskEdit.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  task.getElement()
    .querySelector(`.card__btn--edit`)
    .addEventListener(`click`, () => {
      tasksContainer.replaceChild(taskEdit.getElement(), task.getElement());
      document.addEventListener(`keydown`, onEscKeyDown);
    });

  taskEdit.getElement().querySelector(`textarea`)
    .addEventListener(`focus`, () => {
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

  taskEdit.getElement().querySelector(`textarea`)
    .addEventListener(`blur`, () => {
      document.addEventListener(`keydown`, onEscKeyDown);
    });

  taskEdit.getElement()
    .querySelector(`form`)
    .addEventListener(`submit`, () => {
      tasksContainer.replaceChild(task.getElement(), taskEdit.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

  render(tasksContainer, task.getElement(), Position.BEFOREEND);
};

const renderTasks = (taskItems, from, to) => {
  taskItems.slice(from, to).forEach((task) => renderTask(task));
};

if (isTasksExist) {
  render(board.getElement(), sorting.getElement(), Position.AFTERBEGIN);
  renderTasks(taskMocks, 0, TASK_COUNT);

  let renderedTasks = TASK_COUNT;

  if (taskMocks.length > renderedTasks) {
    render(board.getElement(), loadBtn.getElement(), Position.BEFOREEND);
    const loadButton = mainContainer.querySelector(`.load-more`);
    loadBtn.getElement().addEventListener(`click`, () => {
      renderTasks(taskMocks, renderedTasks, renderedTasks + TASK_COUNT);
      renderedTasks = TASK_COUNT + renderedTasks;
      if (renderedTasks >= taskMocks.length) {
        loadButton.style.opacity = `0`;
      }
    });
  }
} else {
  board.getElement().innerHTML = `
    <p class="board__no-tasks">
      Congratulations, all tasks were completed! To create a new click on
      «add new task» button.
    </p>`;
}
