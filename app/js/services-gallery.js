let windowWidth = document.documentElement.clientWidth;
let isMobileViewport = (windowWidth <= 576) ? true : false;

let servicesGridContainer = document.getElementById('services-grid-container');

servicesGridContainer.countOfItems = 9;
servicesGridContainer.numOfFirstVisibleItem = 0;
servicesGridContainer.maxCountOfVisibleItems = 3;
servicesGridContainer.countOfCurrentTransitions = 0;
servicesGridContainer.isAnimating = false;
servicesGridContainer.transitionDuration = 1000;

Object.defineProperties(servicesGridContainer, {
  'countOfVisibleItems': {
    get: function () {
      if (isMobileViewport) return 1;

      return 3;
    }
  },

  'visibleItems': {
    get: function () {
      return this.selectGroupOfItems(this.numOfFirstVisibleItem, this.countOfVisibleItems);
    }
  },

  'lastVisibleItem': {
    get: function () {
      let numOfLastVisibleItem = (this.numOfFirstVisibleItem + this.countOfVisibleItems - 1)
        % this.countOfItems;

      return this.selectItem(numOfLastVisibleItem);
    }
  },
});

servicesGridContainer.selectItem = function (num) {
  return servicesGridContainer.querySelector(`.item-${num}`);
};

servicesGridContainer.selectGroupOfItems = function (firstNum, length) {
  let items = [];

  for (let i = 0; i < length; i++) {
    let numOfItem = (firstNum + i) % this.countOfItems;
    let item = this.selectItem(numOfItem);
    items.push(item);
  }

  return items;
};

servicesGridContainer.addClassToItems = function (items, cssClass) {
  for (let item of items) {
    item.classList.add(cssClass);
  }
};

servicesGridContainer.removeClassFromItems = function (items, cssClass) {
  for (let item of items) {
    item.classList.remove(cssClass);
  }
};

servicesGridContainer.addArrowsToItem = function (item) {
  let arrows = createArrows();
  configurateArrows(arrows);

  for (arrow of arrows) {
    item.append(arrow);
  }

  return arrows;

  function createArrows() {
    let arrows = [document.createElement('button'), document.createElement('button')];

    for (let arrow of arrows) {
      arrow.classList.add('arrow-90');
    }

    arrows[0].classList.add('left');
    arrows[1].classList.add('right');

    return arrows;
  }

  function configurateArrows(arrows) {
    let countOfItems = servicesGridContainer.countOfItems;
    let countOfVisibleItems = servicesGridContainer.countOfVisibleItems;

    let [leftArrow, rightArrow] = arrows;

    leftArrow.roundAboutConfig = {
      get numOfFirstReplacingItem() {
        return (servicesGridContainer.numOfFirstVisibleItem - countOfVisibleItems + countOfItems)
          % countOfItems;
      }
    };

    rightArrow.roundAboutConfig = {
      get numOfFirstReplacingItem() {
        return (servicesGridContainer.numOfFirstVisibleItem + countOfVisibleItems)
          % countOfItems;
      }
    };
  }
};

servicesGridContainer.removeArrowsFromGrid = function () {
  let arrows = this.querySelectorAll('.arrow-90');

  for (arrow of arrows) {
    arrow.remove();
  }

  return arrows;
};

servicesGridContainer.setDisplayOrderOfItems = function () {

  for (let i = 0; i < this.maxCountOfVisibleItems; i++) {
    let item = this.selectItem(i);
    let order;

    if (this.numOfFirstVisibleItem > this.countOfItems - this.maxCountOfVisibleItems) {
      order = this.countOfItems + i;
    } else {
      order = i;
    }

    item.style.order = order;
  }

  for (let i = this.maxCountOfVisibleItems; i < this.countOfItems; i++) {
    let item = this.selectItem(i);
    item.style.order = i;
  }
};

servicesGridContainer.displayItems = function () {
  let unvisibleItems =
    this.selectGroupOfItems(this.numOfFirstVisibleItem + this.countOfVisibleItems,
      this.countOfItems - this.countOfVisibleItems);

  this.addClassToItems(this.visibleItems, 'visible');
  this.removeClassFromItems(this.visibleItems, 'transparent');

  this.addClassToItems(unvisibleItems, 'transparent');
  this.removeClassFromItems(unvisibleItems, 'visible');

  this.removeArrowsFromGrid();
  this.addArrowsToItem(this.lastVisibleItem);
};

servicesGridContainer.onclick = function () {
  let arrow = event.target.closest('.arrow-90');

  if (!arrow || this.isAnimating) return;

  this.replaceVisibleItems(arrow.roundAboutConfig);
};

servicesGridContainer.replaceVisibleItems = async function (config) {
  let visibleItems = this.visibleItems;
  let replacingItems = selectReplacingItems();

  let lastVisibleItem = this.lastVisibleItem;
  let lastReplacingItem = selectLastReplacingItem();

  let cloneContainer = createCloneOfContainer();

  this.isAnimating = true;
  this.numOfFirstVisibleItem = config.numOfFirstReplacingItem;

  await new Promise(resolve => {
    this.addClassToItems(visibleItems, 'transparent');

    fillContainerWithItems(cloneContainer, replacingItems);
    this.addClassToItems(replacingItems, 'visible');

    setTimeout(resolve, this.transitionDuration);
  });

  await new Promise(resolve => {
    this.setDisplayOrderOfItems();
    this.removeClassFromItems(replacingItems, 'transparent');

    this.removeArrowsFromGrid();
    this.addArrowsToItem(lastReplacingItem);

    setTimeout(resolve, this.transitionDuration);
  });

  await new Promise(resolve => {
    this.removeClassFromItems(visibleItems, 'visible');

    fillContainerWithItems(servicesGridContainer, replacingItems);
    cloneContainer.remove();

    setTimeout(() => {
      this.isAnimating = false;
      resolve();
    });
  });

  /* The next function creates empty grid container with the styles of the original
  and position it under 'servicesGridContainer'. 
  This is done to correctly display the transition of elements*/

  function createCloneOfContainer() {
    let cloneContainer = document.createElement('div');
    cloneContainer.classList.add('grid-container', 'clone-container', 'container');

    servicesGridContainer.append(cloneContainer);
    return cloneContainer;
  }

  function fillContainerWithItems(container, items) {
    for (let item of items) {
      container.append(item);
    }
  }

  function selectReplacingItems() {
    let numOfFirstReplacingItem = config.numOfFirstReplacingItem;

    let replacingItems =
      servicesGridContainer.selectGroupOfItems(numOfFirstReplacingItem, servicesGridContainer.countOfVisibleItems);

    return replacingItems;
  }

  function selectLastReplacingItem() {
    let numOfLastReplacingItem = (config.numOfFirstReplacingItem
      + servicesGridContainer.countOfVisibleItems - 1) % servicesGridContainer.countOfItems;

    let lastReplacingItem = servicesGridContainer.selectItem(numOfLastReplacingItem);

    return lastReplacingItem;
  }

};

servicesGridContainer.setDisplayOrderOfItems();
servicesGridContainer.displayItems();

window.addEventListener('resize', onResize);

function onResize() {
  windowWidth = document.documentElement.clientWidth;

  if (windowWidth <= 720 && !isMobileViewport) {
    isMobileViewport = true;
    servicesGridContainer.displayItems();
  }

  if (windowWidth > 720 && isMobileViewport) {
    isMobileViewport = false;
    servicesGridContainer.displayItems();
  }
}