const Position = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTER: `after`,
  BEFORE: `before`,
};

const KeyCode = {
  ESCAPE: `Escape`,
  ESC: `Esc`,
  ENTER: `Enter`
};

const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
};

const Action = {
  DELETE: `delete`,
  CREATE: `create`,
  UPDATE: `update`
};

const ButtonText = {
  SAVING: `Saving....`,
  DELETING: `Deleting....`,
  SAVE: `Save`,
  DELETE: `Delete`
};

const colorsHex = {
  pink: `#ff3cb9`,
  yellow: `#ffe125`,
  blue: `#0c5cdd`,
  black: `#000000`,
  green: `#31b55c`
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

const render = (container, element, place) => {
  switch (place) {
    case Position.AFTERBEGIN:
      container.prepend(element);
      break;
    case Position.BEFOREEND:
      container.append(element);
      break;
    case Position.AFTER:
      container.after(element);
      break;
    case Position.BEFORE:
      container.before(element);
      break;
  }
};

const unrender = (element) => {
  if (element) {
    element.remove();
  }
};

export {Position, KeyCode, Mode, Action, ButtonText, createElement, colorsHex, render, unrender};
