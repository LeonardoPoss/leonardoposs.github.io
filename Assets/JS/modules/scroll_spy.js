export function initScrollSpy() {
  const sections = document.querySelectorAll('.section');
  const links = document.querySelectorAll('.sidebar-nav a');
  const indicator = document.querySelector('.active-indicator');
  const nav = document.querySelector('.sidebar-nav');
  let lastOffset = 0;

  function moveIndicator(link) {
    const dot = link.querySelector('.dot');
    const dotRect = dot.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();

    const indicatorHeight = indicator.offsetHeight;

    const offset =
      dotRect.top - navRect.top +
      (dotRect.height / 2) -
      (indicatorHeight / 2);

    // limpar direção anterior
    indicator.classList.remove('trail-up', 'trail-down');

    // detectar direção
    if (offset > lastOffset) {
      indicator.classList.add('trail-down');
    } else {
      indicator.classList.add('trail-up');
    }

    // mover
    indicator.style.transform = `translate(-50%, ${offset}px)`;

    lastOffset = offset;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.dataset.section;

        links.forEach(link => {
          link.classList.remove('active');

          if (link.dataset.section === id) {
            link.classList.add('active');
            moveIndicator(link);
          }
        });

        //  sincroniza URL 
        history.replaceState(null, null, `#${id}`);
      }
    });
  }, {
    root: document.querySelector('#main-content'),
    threshold: 0.6
  });

  sections.forEach(section => observer.observe(section));
  

  // Inicialização (posição correta ao carregar)
  const initialActive = document.querySelector('.sidebar-nav a.active') || links[0];
  if (initialActive) {
    moveIndicator(initialActive);
  }
}