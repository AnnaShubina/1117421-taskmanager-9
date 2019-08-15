import tasks from './task.js';

export default [
  {
    title: `All`,
    count: tasks.length - tasks.filter(({isArchive}) => isArchive).length
  },
  {
    title: `Overdue`,
    count: tasks.filter(({dueDate}) => new Date(dueDate) < Date.now()).length
  },
  {
    title: `Today`,
    count: tasks.filter(({dueDate}) => new Date(dueDate).getDate() === new Date().getDate()).length
  },
  {
    title: `Favorites`,
    count: tasks.filter(({isFavorite}) => isFavorite).length
  },
  {
    title: `Repeating`,
    count: tasks.filter(({repeatingDays}) => Object.keys(repeatingDays).some((day) => repeatingDays[day])).length
  },
  {
    title: `Tags`,
    count: tasks.filter(({tags}) => tags.size).length
  },
  {
    title: `Archive`,
    count: tasks.filter(({isArchive}) => isArchive).length
  }
];
