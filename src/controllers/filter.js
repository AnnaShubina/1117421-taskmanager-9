import {Position, render, unrender} from '../utils.js';
import Filter from '../components/filter.js';
import moment from 'moment';

export default class FilterController {
  constructor(container, tasks, onFilterSwitch) {
    this._container = container;
    this._tasks = tasks;
    this._filter = new Filter(this._tasks);
    this._onFilterSwitch = onFilterSwitch;

    this.create();
  }

  create() {
    this._filter.getElement().querySelectorAll(`.filter__label`).forEach((element) => {
      element.addEventListener(`click`, (evt) => {
        const id = evt.target.getAttribute(`for`);
        const isRepeat = (repeatingDays) => Object.keys(repeatingDays).some((day) => repeatingDays[day]);
        let newTasks = this._tasks;
        switch (id) {
          case `all`:
            newTasks = this._tasks.filter(({isArchive}) => !isArchive);
            break;
          case `overdue`:
            newTasks = this._tasks.filter(({dueDate}) => moment(dueDate).isBefore(moment(), `day`));
            break;
          case `today`:
            newTasks = this._tasks.filter(({dueDate}) => moment(dueDate).isSame(moment(), `day`));
            break;
          case `repeating`:
            newTasks = this._tasks.filter(({repeatingDays}) => isRepeat(repeatingDays));
            break;
          case `tags`:
            newTasks = this._tasks.filter(({tags}) => tags.size);
            break;
          case `archive`:
            newTasks = this._tasks.filter(({isArchive}) => isArchive);
            break;
          case `favorites`:
            newTasks = this._tasks.filter(({isFavorite}) => isFavorite);
            break;
        }

        this._onFilterSwitch(newTasks);
      });

    });

    render(this._container, this._filter.getElement(), Position.AFTER);
  }

  _unrender() {
    unrender(this._filter.getElement());
    this._filter.removeElement();
  }

  filterChange(tasks) {
    this._unrender();
    this._filter.changeCounts(tasks);
    this.create();
  }
}
