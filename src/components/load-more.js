import AbstractComponent from './absctract-component.js';

export default class LoadMore extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `
      <button class="load-more" type="button">load more</button>
    `.trim();
  }
}
