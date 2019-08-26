import Board from '../components/board.js';
import TaskList from '../components/task-list.js';
import TaskForm from '../components/task-form.js';
import Task from '../components/task.js';
import Sorting from '../components/sorting.js';
import LoadMore from '../components/load-more.js';
import {Position, KeyCode, render} from '../utils.js';

export default class BoardController {
  constructor(container, tasks) {
    this._container = container;
    this._tasks = tasks;
    this._board = new Board();
    this._taskList = new TaskList();
    this._sorting = new Sorting();
    this._loadBtn = new LoadMore();
  }

  init() {
    const TASK_COUNT = 8;
    const isTasksExist = this._tasks.length && !this._tasks.filter(({isArchive}) => isArchive).length;

    if (isTasksExist) {
      this._renderBoard(TASK_COUNT);
    } else {
      this._renderEmptyMessage();
    }
  }

  _renderTasks(taskItems, from, to) {
    taskItems.slice(from, to).forEach((task) => this._renderTask(task));
  }

  _renderTask(taskMock) {
    const task = new Task(taskMock);
    const taskEdit = new TaskForm(taskMock);

    const onEscKeyDown = (evt) => {
      if (evt.key === KeyCode.ESCAPE || evt.key === KeyCode.ESC) {
        this._taskList.getElement().replaceChild(task.getElement(), taskEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    task.getElement()
      .querySelector(`.card__btn--edit`)
      .addEventListener(`click`, () => {
        this._taskList.getElement().replaceChild(taskEdit.getElement(), task.getElement());
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
        this._taskList.getElement().replaceChild(task.getElement(), taskEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    render(this._taskList.getElement(), task.getElement(), Position.BEFOREEND);
  }

  _renderBoard(count) {
    render(this._container, this._board.getElement(), Position.BEFOREEND);
    render(this._board.getElement(), this._taskList.getElement(), Position.BEFOREEND);
    render(this._board.getElement(), this._sorting.getElement(), Position.AFTERBEGIN);
    this._renderTasks(this._tasks, 0, count);

    if (this._tasks.length > count) {
      this._renderLoadBtn(count);
    }
  }

  _renderLoadBtn(count) {
    let renderedTasks = count;
    render(this._board.getElement(), this._loadBtn.getElement(), Position.BEFOREEND);
    this._loadBtn.getElement().addEventListener(`click`, () => {
      this._renderTasks(this._tasks, renderedTasks, renderedTasks + count);
      renderedTasks = count + renderedTasks;
      if (renderedTasks >= this._tasks.length) {
        this._loadBtn.getElement().style.opacity = `0`;
      }
    });
  }

  _renderEmptyMessage() {
    this._board.getElement().innerHTML = `
      <p class="board__no-tasks">
        Congratulations, all tasks were completed! To create a new click on
        «add new task» button.
      </p>`;
  }
}
