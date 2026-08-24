const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');

menuToggle.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.textContent = isOpen ? 'Close' : 'Menu';
});

document.querySelectorAll('.site-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.textContent = 'Menu';
  });
});

document.querySelectorAll('.filter').forEach((filterButton) => {
  filterButton.addEventListener('click', () => {
    document.querySelector('.filter.active').classList.remove('active');
    filterButton.classList.add('active');
    const selectedFilter = filterButton.dataset.filter;

    document.querySelectorAll('.project-card').forEach((project) => {
      const shouldShow = selectedFilter === 'all' || project.dataset.category === selectedFilter;
      project.classList.toggle('is-hidden', !shouldShow);
    });
  });
});
