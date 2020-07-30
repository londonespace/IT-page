let servicesGridContainer = document.getElementById('services-grid-container');

servicesGridContainer.numOfCurrentGrid = 0;
servicesGridContainer.isAnimating = false;
servicesGridContainer.transitionDuration = 1000;

for (let leftArrow of servicesGridContainer.querySelectorAll('.arrow-90.left')) {
  leftArrow.roundAboutConfig = {
    get numOfReplacingGrid() {
      return (servicesGridContainer.numOfCurrentGrid - 1 + 3) % 3
    }
  };
}

for (let rightArrow of servicesGridContainer.querySelectorAll('.arrow-90.right')) {
  rightArrow.roundAboutConfig = {
    get numOfReplacingGrid() {
      return (servicesGridContainer.numOfCurrentGrid + 1) % 3
    }
  };
}

servicesGridContainer.addEventListener('mouseover', onMouseOver);
servicesGridContainer.addEventListener('click', onClick);
servicesGridContainer.addEventListener('transitionstart', onTransitionStart);

function onMouseOver() {
  let lastItem = event.target.closest('.last-item');
  if (!lastItem) return;

  let arrows = lastItem.querySelectorAll('.arrow-90');

  for (let arrow of arrows) {
    arrow.classList.add('into-hover');
  }

  lastItem.addEventListener('mouseleave', onMouseLeave);

  function onMouseLeave() {
    for (let arrow of arrows) {
      arrow.classList.remove('into-hover');
    }

    lastItem.removeEventListener('mouseleave', onMouseLeave);
  }
}

function onClick() {
  let target = event.target.closest('.arrow-90');

  if (!target || servicesGridContainer.isAnimating) return;

  replaceServiceGrid(target.roundAboutConfig);
}

async function replaceServiceGrid(config) {
  let numOfCurrentGrid = servicesGridContainer.numOfCurrentGrid;
  let numOfReplacingGrid = config.numOfReplacingGrid;

  let transitionDuration = servicesGridContainer.transitionDuration

  let currentGrid = defineGrid(numOfCurrentGrid);
  let replacingGrid = defineGrid(numOfReplacingGrid);

  servicesGridContainer.numOfCurrentGrid = numOfReplacingGrid;

  await new Promise(resolve => {
    currentGrid.classList.add('transparent');

    replacingGrid.classList.remove('hidden');
    replacingGrid.classList.add('psa');

    setTimeout(resolve, transitionDuration / 2);
  });

  await new Promise(resolve => {
    currentGrid.classList.add('hidden');
    replacingGrid.classList.remove('transparent', 'psa');
    setTimeout(resolve);
  });

  function defineGrid(num) {
    return servicesGridContainer.querySelector(`.grid-${num}`);
  }
}

function onTransitionStart() {
  if (!event.target.classList.contains('services-grid')) return;
  servicesGridContainer.isAnimating = true;

  let grid = event.target;
  grid.addEventListener('transitionend', onTransitionEnd);

  function onTransitionEnd() {
    servicesGridContainer.isAnimating = false;
  }
}