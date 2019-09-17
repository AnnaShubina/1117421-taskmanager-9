import TaskForm from '../components/task-form.js';
import Task from '../components/task.js';
import {Position, KeyCode, Mode, render} from '../utils.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';

export default class TaskController {
  constructor(container, data, mode, onChangeView, onDataChange) {
    this._container = container;
    this._data = data;
    this._taskView = new Task(data);
    this._taskEdit = new TaskForm(data);
    this._onChangeView = onChangeView;
    this._onDataChange = onDataChange;

    this.create(mode);
  }

  create(mode) {
    let renderPosition = Position.BEFOREEND;
    let currentView = this._taskView;

    if (mode === Mode.ADDING) {
      renderPosition = Position.AFTERBEGIN;
      currentView = this._taskEdit;
    }

    flatpickr(this._taskEdit.getElement().querySelector(`.card__date`), {
      altInput: true,
      allowInput: true,
      defaultDate: this._data.dueDate,
    });

    const onEscKeyDown = (evt) => {
      if (evt.key === KeyCode.ESCAPE || evt.key === KeyCode.ESC) {
        if (mode === Mode.DEFAULT) {
          if (this._container.contains(this._taskEdit.getElement())) {
            this._container.replaceChild(this._taskView.getElement(), this._taskEdit.getElement());
          }
        } else if (mode === Mode.ADDING) {
          this._container.removeChild(currentView.getElement());
        }
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    this._taskView.getElement()
      .querySelector(`.card__btn--edit`)
      .addEventListener(`click`, () => {
        this._onChangeView();
        this._container.replaceChild(this._taskEdit.getElement(), this._taskView.getElement());
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    this._taskView.getElement()
      .querySelector(`.card__btn--archive`)
      .addEventListener(`click`, () => {
        this._addToArchive();
      });

    this._taskView.getElement()
      .querySelector(`.card__btn--favorites`)
      .addEventListener(`click`, () => {
        this._addToFavorite();
      });

    if (this._data.color) {
      this._taskEdit.getElement().querySelector(`#color-${this._data.color}-4`).checked = true;
    }

    this._taskEdit.getElement().querySelector(`textarea`)
      .addEventListener(`focus`, () => {
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    this._taskEdit.getElement().querySelector(`textarea`)
      .addEventListener(`blur`, () => {
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    this._taskEdit.getElement().querySelector(`.card__delete`)
      .addEventListener(`click`, () => {
        this._onDataChange(`delete`, this._data);
      });

    this._taskEdit.getElement()
      .querySelector(`form`)
      .addEventListener(`submit`, (evt) => {
        evt.preventDefault();

        const formData = new FormData(this._taskEdit.getElement().querySelector(`.card__form`));
        this._data.description = formData.get(`text`);
        this._data.color = formData.get(`color`);
        this._data.tags = new Set(formData.getAll(`hashtag`));
        this._data.dueDate = formData.get(`date`) ? new Date(formData.get(`date`)) : ``;
        this._data.repeatingDays = formData.getAll(`repeat`).reduce((acc, it) => {
          acc[it] = true;
          return acc;
        }, {
          'mo': false,
          'tu': false,
          'we': false,
          'th': false,
          'fr': false,
          'sa': false,
          'su': false,
        });

        this._onDataChange(mode === Mode.DEFAULT ? `update` : `create`, this._data);
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    render(this._container, currentView.getElement(), renderPosition);
  }

  setDefaultView() {
    if (this._container.contains(this._taskEdit.getElement())) {
      this._container.replaceChild(this._taskView.getElement(), this._taskEdit.getElement());
    }
  }

  _addToArchive() {
    this._data.isArchive = true;
    this._onDataChange(`update`, this._data);
  }

  _addToFavorite() {
    this._data.isFavorite = true;
    this._onDataChange(`update`, this._data);
  }
}
