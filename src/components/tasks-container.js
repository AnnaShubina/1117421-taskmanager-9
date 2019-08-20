import {createElement} from '../utils.js';

export default class TaskContainer {
  constructor() {
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
  
  getTemplate() {
    return `
      <section class="board container">
        <div class="board__tasks">
        </div>
      </section>`.trim();
  }
}
