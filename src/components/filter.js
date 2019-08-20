export default class Filter {
  constructor(filtres) {
    this._filtres = filtres;
    this._element = null;
  }
  
  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  getTemplate() {
    return `
      <section class="main__filter filter container"> 
        ${this._filters.map(({title, count}) => `
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
