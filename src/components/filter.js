import AbstractComponent from './absctract-component.js';

export default class Filter extends AbstractComponent {
  constructor(data) {
    super();
    this._data = data;
  }

  changeData(newData) {
    this._data = newData;
  }

  getTemplate() {
    return `
      <section class="main__filter filter container"> 
        ${this._data.map(({title, id, count}) => `
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
