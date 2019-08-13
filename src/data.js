const getTask = () => ({
    description: [
        `Изучить теорию`,
        `Сделать домашку`,
        `Пройти интенсив на соточку`,
    ][Math.floor(Math.random() * 3)],
    dueDate: Date.now() + 1 + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000,
    tags: new Set([
        `homework`,
        `theory`,
        `practice`,
        `intensive`,
        `keks`,
    ]),
    repeatingDays: {
        'mo': false,
        'tu': false,
        'we': Boolean(Math.round(Math.random())),
        'th': false,
        'fr': false,
        'sa': false,
        'su': false,
    },
    color: [
        `black`,
        `yellow`,
        `blue`,
        `green`,
        `pink`,
    ][Math.floor(Math.random() * 5)],
    isFavorite: false,
    isArchive: false
});

const getTasksList = () => [0, 1, 2];

const getFilter = () => ([
        {
            title: `All`,
            count: 0
        },
        {
            title: `Overdue`,
            count: 0
        },
        {
            title: `Today`,
            count: 3
        },
        {
            title: `Favorites`,
            count: 10
        },
        {
            title: `Repeating`,
            count: 0
        },
        {
            title: `Tags`,
            count: 0
        },
        {
            title: `Archive`,
            count: 20
        }
]);

export {getTask, getTasksList, getFilter};
