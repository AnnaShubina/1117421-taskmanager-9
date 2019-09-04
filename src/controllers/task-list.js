import TaskController from '../controllers/task.js';
import {Mode as TaskControllerMode} from '../utils.js';

export default class TaskListController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChangeMain = onDataChange;
    this._creatingTask = null;
    this._subscriptions = [];
    this._tasks = [];
    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
  }

  setTasks(tasks) {
    this._tasks = tasks;
    this._subscriptions = [];

    this._container.innerHTML = ``;
    this._tasks.forEach((task) => this._renderTask(task));
  }

  addTasks(tasks) {
    tasks.forEach((task) => this._renderTask(task));
    this._tasks = this._tasks.concat(tasks);
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
    this._creatingTask = new TaskController(this._container, defaultTask, TaskControllerMode.ADDING, this._onChangeView, (...args) => {
      this._creatingTask = null;
      this._onDataChange(...args);
    });
  }

  _renderTask(task) {
    const taskController = new TaskController(this._container, task, TaskControllerMode.DEFAULT, this._onChangeView, this._onDataChange);
    this._subscriptions.push(taskController.setDefaultView.bind(taskController));
  }

  _onChangeView() {
    this._subscriptions.forEach((it) => it());
  }

  _onDataChange(newData, oldData) {
    const index = this._tasks.findIndex((task) => task === oldData);

    if (newData === null) {
      this._tasks = [...this._tasks.slice(0, index), ...this._tasks.slice(index + 1)];
    } else if (oldData === null) {
      this._tasks = [newData, ...this._tasks];
    } else {
      this._tasks[index] = newData;
    }

    this.setTasks(this._tasks);

    this._onDataChangeMain(this._tasks);
  }
}
