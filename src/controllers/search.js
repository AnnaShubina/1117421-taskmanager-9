import {Position, render, unrender} from '../utils.js';
import SearchResult from '../components/search-result.js';
import SearchResultGroup from '../components/search-result-group.js';
import SearchResultInfo from '../components/search-result-info.js';
import SearchNoResult from '../components/search-no-result.js';
import TaskListController from '../controllers/task-list.js';
import moment from 'moment';

export default class SearchController {
  constructor(container, search, onBackButtonClick) {
    this._container = container;
    this._search = search;
    this._onBackButtonClick = onBackButtonClick;
    this._tasks = [];

    this._searchResult = new SearchResult();
    this._searchNoResult = new SearchNoResult();
    this._searchResultInfo = new SearchResultInfo({});
    this._searchResultGroup = new SearchResultGroup({});
    this._taskListController = new TaskListController(this._searchResultGroup.getElement().querySelector(`.result__cards`), this._onDataChange.bind(this));

    this._init();
  }

  _init() {
    this.hide();

    render(this._container, this._searchResult.getElement(), Position.BEFOREEND);
    render(this._searchResult.getElement(), this._searchResultGroup.getElement(), Position.BEFOREEND);
    render(this._searchResultGroup.getElement(), this._searchResultInfo.getElement(), Position.AFTERBEGIN);

    this._searchResult.getElement().querySelector(`.result__back`)
      .addEventListener(`click`, () => {
        this._search.getElement().querySelector(`input`).value = ``;
        this._onBackButtonClick();
      });
    this._search.getElement().querySelector(`input`)
      .addEventListener(`keyup`, (evt) => {
        const {value} = evt.target;

        if (value === ``) {
          this._showSearchResult(value, this._tasks);
        } else if (value.length > 2) {
          const tasks = this._parseValue(value);
          this._showSearchResult(value, tasks);
        }
      });
  }

  _parseValue(value) {
    const valueSliced = value.slice(1, value.length + 1);
    let tasks;
    if (value.startsWith(`#`)) {
      tasks = this._tasks.filter((task) => {
        return Array.from(task.tags).includes(valueSliced);
      });
    } else if (value.startsWith(`D`)) {
      tasks = this._tasks.filter((task) => {
        const date = moment(task.dueDate).format(`DD/MM/YYYY`);
        return date === valueSliced.replace(/\./g, `/`);
      });
    } else {
      tasks = this._tasks.filter((task) => {
        return task.description.includes(value);
      });
    }

    return tasks;
  }

  hide() {
    this._searchResult.getElement().classList.add(`visually-hidden`);
  }

  setTasks(tasks) {
    this._tasks = tasks;
  }

  show() {
    if (this._searchResult.getElement().classList.contains(`visually-hidden`)) {
      this._showSearchResult(``, this._tasks);
      this._searchResult.getElement().classList.remove(`visually-hidden`);
    }
  }

  _showSearchResult(text, tasks) {
    if (this._searchResultInfo) {
      unrender(this._searchResultInfo.getElement());
      this._searchResultInfo.removeElement();
    }

    this._searchResultInfo = new SearchResultInfo({
      title: text,
      count: tasks.length
    });
    render(this._searchResultGroup.getElement(), this._searchResultInfo.getElement(), Position.AFTERBEGIN);

    if (tasks.length) {
      unrender(this._searchNoResult.getElement());
      this._searchNoResult.removeElement();
      this._taskListController.setTasks(tasks);
    } else {
      render(this._searchResultInfo.getElement(), this._searchNoResult.getElement(), Position.AFTER);
      this._taskListController.clearTasks();
    }
  }

  _onDataChange(tasks) {
    this._tasks = tasks;
  }
}
