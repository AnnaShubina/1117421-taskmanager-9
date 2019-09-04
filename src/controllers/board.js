import Board from '../components/board.js';
import TaskList from '../components/task-list.js';
import Sorting from '../components/sorting.js';
import LoadMore from '../components/load-more.js';
import TaskListController from '../controllers/task-list.js';
import {Position, render, unrender} from '../utils.js';

export default class BoardController {
  constructor(container) {
    this._TASK_COUNT = 8;
    this._container = container;
    this._tasks = [];
    this._board = new Board();
    this._taskList = new TaskList();
    this._sorting = new Sorting();
    this._loadBtn = new LoadMore();
    this._taskListController = new TaskListController(this._taskList, this._onDataChange.bind(this));

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
    if (tasks !== this._tasks) {
      this._setTasks(tasks);
    }

    this._board.getElement().classList.remove(`visually-hidden`);
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
      this._renderBoard();
    } else {
      this._renderEmptyMessage();
    }
  }

  _onDataChange(tasks) {
    this._tasks = tasks;

    this._renderBoard();
  }

  _renderBoard() {
    this._clearBoard();

    render(this._board.getElement(), this._taskList.getElement(), Position.BEFOREEND);
    this._taskListController.setTasks(this._tasks.slice(0, this._TASK_COUNT));

    if (this._tasks.length > this._TASK_COUNT) {
      this._renderLoadBtn();
    }
  }

  _renderLoadBtn() {
    let renderedTasks = this._TASK_COUNT;
    render(this._board.getElement(), this._loadBtn.getElement(), Position.BEFOREEND);
    this._loadBtn.getElement().addEventListener(`click`, () => {
      this._taskListController.addTasks(this._tasks.slice(renderedTasks, renderedTasks + this._TASK_COUNT));
      renderedTasks = this._TASK_COUNT + renderedTasks;
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

    this._clearBoard();

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

  _clearBoard() {
    unrender(this._taskList.getElement());
    unrender(this._loadBtn.getElement());
    this._taskList.removeElement();
    this._loadBtn.removeElement();
  }
}
