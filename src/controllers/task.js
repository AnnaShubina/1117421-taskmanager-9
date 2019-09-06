import TaskForm from '../components/task-form.js';
import Task from '../components/task.js';
import {Position, KeyCode, Mode, render} from '../utils.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';

export default class TaskController {
  constructor(container, data, mode, onChangeView, onDataChange,) {
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
        this._onDataChange(null, this._data);
      });

    this._taskEdit.getElement()
      .querySelector(`form`)
      .addEventListener(`submit`, (evt) => {
        evt.preventDefault();

        const formData = new FormData(this._taskEdit.getElement().querySelector(`.card__form`));
        const entry = {
          description: formData.get(`text`),
          color: formData.get(`color`),
          tags: new Set(formData.getAll(`hashtag`)),
          dueDate: formData.get(`date`) ? new Date(formData.get(`date`)) : ``,
          repeatingDays: formData.getAll(`repeat`).reduce((acc, it) => {
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
          })
        };

        this._onDataChange(entry, mode === Mode.DEFAULT ? this._data : null);
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
    const newData = Object.assign({}, this._data);
    if (newData.isArchive) {
      newData.isArchive = false;
    } else {
      newData.isArchive = true;
    }
    this._onDataChange(newData, this._data);
  }

  _addToFavorite() {
    const newData = Object.assign({}, this._data);
    if (newData.isFavorite) {
      newData.isFavorite = false;
    } else {
      newData.isFavorite = true;
    }
    this._onDataChange(newData, this._data);
  }
}
