import AbstractComponent from './absctract-component.js';

export default class SearchNoResult extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `<p class="result__empty">no matches found...</p>`.trim();
  }
}
