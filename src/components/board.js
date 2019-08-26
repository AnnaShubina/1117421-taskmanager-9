import AbstractComponent from './absctract-component.js';

export default class Board extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `<section class="board container"></section>`.trim();
  }
}
