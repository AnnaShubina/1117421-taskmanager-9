export const getFilterTemplate = (filters) => {
  return `
    <section class="main__filter filter container"> 
      ${filters.map((fiter) => `
        <input
          type="radio"
          id="filter__${fiter.title}"
          class="filter__input visually-hidden"
          name="filter"
          checked
        />
        <label for="filter__${fiter.title}" class="filter__label">
        ${fiter.title}
        <span class="filter__${fiter.title}-count">${fiter.count}</span></label
        >
      `).join(``)}
    </section>`.trim();
};
