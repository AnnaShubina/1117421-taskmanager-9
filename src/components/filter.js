import AbstractComponent from './absctract-component.js';

export default class Filter extends AbstractComponent {
  constructor(filtres) {
    super();
    this._filtres = filtres;
  }

  getTemplate() {
    return `
      <section class="main__filter filter container"> 
        ${this._filtres.map(({title, count}) => `
          <input
            type="radio"
            id="filter__${title}"
            class="filter__input visually-hidden"
            name="filter"
            checked
          />
          <label for="filter__${title}" class="filter__label">
          ${title}
          <span class="filter__${title}-count">${count}</span></label
          >
        `).join(``)}
      </section>`.trim();
  }
}
