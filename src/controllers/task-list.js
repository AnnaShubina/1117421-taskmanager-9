import TaskController from '../controllers/task.js';
import LoadMore from '../components/load-more.js';
import {Mode as TaskControllerMode, Position, render, unrender} from '../utils.js';

const TASK_COUNT_SHOW = 8;

export default class TaskListController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChangeMain = onDataChange;
    this._creatingTask = null;
    this._subscriptions = [];
    this._tasks = [];
    this._loadBtn = new LoadMore();
    this._showedTasks = TASK_COUNT_SHOW;
    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
  }

  setTasks(tasks) {
    this._tasks = tasks;
    this._subscriptions = [];
    this._container.innerHTML = ``;
    this._renderTasks(this._tasks.filter(({isArchive}) => !isArchive));
  }

  _renderTasks(tasks) {
    if (this._showedTasks > TASK_COUNT_SHOW) {
      this._showedTasks = TASK_COUNT_SHOW;
    }
    tasks.slice(0, this._showedTasks).forEach((task) => this._renderTask(task));

    if (tasks.length > this._showedTasks) {
      this._renderLoadBtn();
    } else {
      this._deleteLoadMoreBtn();
    }
  }

  addTasks(tasks) {
    tasks.forEach((task) => this._renderTask(task));
  }

  clearTasks() {
    this._container.innerHTML = ``;
    this._deleteLoadMoreBtn();
    this._showedTasks = TASK_COUNT_SHOW;
  }

  renderFilteredTasks(tasks) {
    this.clearTasks();
    this._renderTasks(tasks);
  }

  createTask() {
    if (this._creatingTask) {
      return;
    }

    const defaultTask = {
      description: ``,
      dueDate: new Date(),
      tags: new Set(),
      color: ``,
      repeatingDays: {
        'mo': false,
        'tu': false,
        'we': false,
        'th': false,
        'fr': false,
        'sa': false,
        'su': false,
      },
      isFavorite: false,
      isArchive: false,
    };

    this._creatingTask = new TaskController(this._container, defaultTask, TaskControllerMode.ADDING, this._onChangeView, this._onDataChange);
  }

  _renderTask(task) {
    const taskController = new TaskController(this._container, task, TaskControllerMode.DEFAULT, this._onChangeView, this._onDataChange);
    this._subscriptions.push(taskController.setDefaultView.bind(taskController));
  }

  _renderLoadBtn() {
    render(this._container, this._loadBtn.getElement(), Position.AFTER);
    this._loadBtn.getElement().addEventListener(`click`, () => {
      this.addTasks(this._tasks.slice(this._showedTasks, this._showedTasks + TASK_COUNT_SHOW));
      this._showedTasks += TASK_COUNT_SHOW;
      if (this._showedTasks >= this._tasks.length) {
        this._deleteLoadMoreBtn();
      }
    });
  }

  _deleteLoadMoreBtn() {
    unrender(this._loadBtn.getElement());
    this._loadBtn.removeElement();
  }

  _onChangeView() {
    this._subscriptions.forEach((it) => it());
  }

  _onDataChange(newData, oldData) {
    const index = this._tasks.findIndex((task) => task === oldData);

    if (newData === null) {
      this._tasks = [...this._tasks.slice(0, index), ...this._tasks.slice(index + 1)];
      this._showedTasks = Math.min(this._showedTasks, this._tasks.length);
    } else if (oldData === null) {
      this._creatingTask = null;
      this._tasks = [newData, ...this._tasks];
      this._showedTasks = Math.max(this._showedTasks, this._tasks.length);
    } else {
      this._tasks[index] = newData;
    }

    this.setTasks(this._tasks);

    this._onDataChangeMain(this._tasks);
  }
}
