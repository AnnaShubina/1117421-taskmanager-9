import AbstractComponent from './absctract-component.js';

export default class SearchResultGroup extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `<section class="result__group">
      <div class="result__cards"></div>
      <!--Append tasks here-->
    </section>`.trim();
  }
}
