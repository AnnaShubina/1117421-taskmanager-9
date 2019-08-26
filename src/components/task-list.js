import AbstractComponent from './absctract-component.js';

export default class TaskList extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `<div class="board__tasks"></div>`.trim();
  }
}
