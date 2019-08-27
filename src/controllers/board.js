import Board from '../components/board.js';
import TaskList from '../components/task-list.js';
import TaskForm from '../components/task-form.js';
import Task from '../components/task.js';
import Sorting from '../components/sorting.js';
import LoadMore from '../components/load-more.js';
import {Position, KeyCode, render, unrender} from '../utils.js';

export default class BoardController {
  constructor(container, tasks) {
    this._TASK_COUNT = 8;
    this._container = container;
    this._tasks = tasks;
    this._board = new Board();
    this._taskList = new TaskList();
    this._sorting = new Sorting();
    this._loadBtn = new LoadMore();
  }

  init() {
    const isTasksExist = this._tasks.length && !this._tasks.filter(({isArchive}) => isArchive).length;

    if (isTasksExist) {
      this._renderBoard(this._tasks, this._TASK_COUNT);
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

  _renderBoard(tasks, count) {
    render(this._container, this._board.getElement(), Position.BEFOREEND);
    render(this._board.getElement(), this._taskList.getElement(), Position.BEFOREEND);
    render(this._board.getElement(), this._sorting.getElement(), Position.AFTERBEGIN);
    this._renderTasks(tasks, 0, count);

    if (tasks.length > count) {
      this._renderLoadBtn(tasks, count);
    }

    this._sorting.getElement().addEventListener(`click`, (evt) => this._onSortLinkClick(evt));
  }

  _renderLoadBtn(tasks, count) {
    let renderedTasks = count;
    render(this._board.getElement(), this._loadBtn.getElement(), Position.BEFOREEND);
    this._loadBtn.getElement().addEventListener(`click`, () => {
      this._renderTasks(tasks, renderedTasks, renderedTasks + count);
      renderedTasks = count + renderedTasks;
      if (renderedTasks >= tasks.length) {
        this._loadBtn.getElement().style.opacity = `0`;
      }
    });
  }

  _onSortLinkClick(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== `A`) {
      return;
    }

    unrender(this._taskList.getElement());
    unrender(this._loadBtn.getElement());
    this._taskList.removeElement();
    this._loadBtn.removeElement();

    switch (evt.target.dataset.sortType) {
      case `date-up`:
        const sortedByDateUpTasks = this._tasks.slice().sort((a, b) => a.dueDate - b.dueDate);
        this._renderBoard(sortedByDateUpTasks, this._TASK_COUNT);
        break;
      case `date-down`:
        const sortedByDateDownTasks = this._tasks.slice().sort((a, b) => b.dueDate - a.dueDate);
        this._renderBoard(sortedByDateDownTasks, this._TASK_COUNT);
        break;
      case `default`:
        this._renderBoard(this._tasks, this._TASK_COUNT);
        break;
    }
  }

  _renderEmptyMessage() {
    this._board.getElement().innerHTML = `
      <p class="board__no-tasks">
        Congratulations, all tasks were completed! To create a new click on
        «add new task» button.
      </p>`;
  }
}
