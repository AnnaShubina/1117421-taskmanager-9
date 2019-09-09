import AbstractComponent from './absctract-component.js';
import moment from 'moment';

export default class Filter extends AbstractComponent {
  constructor(tasks) {
    super();
    this._tasks = tasks;
  }

  changeCounts(newTasks) {
    this._tasks = newTasks;
  }

  _getCounts() {
    return [
      {
        id: `all`,
        title: `All`,
        count: this._tasks.length - this._tasks.filter(({isArchive}) => isArchive).length
      },
      {
        id: `overdue`,
        title: `Overdue`,
        count: this._tasks.filter(({dueDate}) => moment(dueDate).isBefore(moment(), `day`)).length
      },
      {
        id: `today`,
        title: `Today`,
        count: this._tasks.filter(({dueDate}) => moment(dueDate).isSame(moment(), `day`)).length
      },
      {
        id: `favorites`,
        title: `Favorites`,
        count: this._tasks.filter(({isFavorite}) => isFavorite).length
      },
      {
        id: `repeating`,
        title: `Repeating`,
        count: this._tasks.filter(({repeatingDays}) => Object.keys(repeatingDays).some((day) => repeatingDays[day])).length
      },
      {
        id: `tags`,
        title: `Tags`,
        count: this._tasks.filter(({tags}) => tags.size).length
      },
      {
        id: `archive`,
        title: `Archive`,
        count: this._tasks.filter(({isArchive}) => isArchive).length
      }
    ];
  }

  getTemplate() {
    return `
      <section class="main__filter filter container"> 
        ${this._getCounts().map(({title, id, count}) => `
          <input
            type="radio"
            id="${id}"
            class="filter__input visually-hidden"
            name="filter"
            ${count ? `` : `disabled`}
          />
          <label for="${id}" class="filter__label">
          ${title}
          <span class="filter__${title}-count">${count}</span></label
          >
        `).join(``)}
      </section>`.trim();
  }
}
