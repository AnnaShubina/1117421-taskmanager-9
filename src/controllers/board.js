import Board from '../components/board.js';
import TaskList from '../components/task-list.js';
import Sorting from '../components/sorting.js';
import TaskListController from '../controllers/task-list.js';
import {Position, render} from '../utils.js';

export default class BoardController {
  constructor(container, onDataChange) {
    this._container = container;
    this._tasks = [];
    this._board = new Board();
    this._taskList = new TaskList();
    this._sorting = new Sorting();
    this._onDataChangeMain = onDataChange;
    this._taskListController = new TaskListController(this._taskList.getElement(), this._onDataChange.bind(this));

    this._init();
  }

  _init() {
    render(this._container, this._board.getElement(), Position.BEFOREEND);
    render(this._board.getElement(), this._sorting.getElement(), Position.AFTERBEGIN);
    render(this._board.getElement(), this._taskList.getElement(), Position.BEFOREEND);
    this._sorting.getElement().addEventListener(`click`, (evt) => this._onSortLinkClick(evt));
  }

  hide() {
    this._board.getElement().classList.add(`visually-hidden`);
  }

  show(tasks) {
    if (tasks && tasks !== this._tasks) {
      this._setTasks(tasks);
      this._board.getElement().classList.remove(`visually-hidden`);
    } else {
      this._board.getElement().classList.remove(`visually-hidden`);
    }
  }

  createTask() {
    this._taskListController.createTask();
  }

  _setTasks(tasks) {
    this._tasks = tasks;

    const isTasksExist = this._tasks.length && !this._tasks.filter(({
      isArchive
    }) => isArchive).length;

    if (isTasksExist) {
      this._renderBoard(this._tasks);
    } else {
      this._renderEmptyMessage();
    }
  }

  _onDataChange(tasks) {
    this._tasks = tasks;
    this._renderBoard(this._tasks);
  }

  _renderBoard(tasks) {
    render(this._board.getElement(), this._taskList.getElement(), Position.BEFOREEND);
    this._taskListController.setTasks(tasks);
  }

  _onSortLinkClick(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== `A`) {
      return;
    }

    switch (evt.target.dataset.sortType) {
      case `date-up`:
        const sortedByDateUpTasks = this._tasks.slice().sort((a, b) => a.dueDate - b.dueDate);
        this._renderBoard(sortedByDateUpTasks);
        break;
      case `date-down`:
        const sortedByDateDownTasks = this._tasks.slice().sort((a, b) => b.dueDate - a.dueDate);
        this._renderBoard(sortedByDateDownTasks);
        break;
      case `default`:
        this._renderBoard(this._tasks);
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
