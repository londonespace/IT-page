serviceGridContainer.replaceVisibleItems = async function (config) {
  let numOfFirstVisibleItem = this.numOfFirstVisibleItem;
  let numOfFirstReplacingItem = config.numOfFirstReplacingItem;

  let cloneContainer = createCloneOfContainer();

  /* This function creates empty grid container with the styles of the original
  and position it under 'servicesGridContainer'. 
  This is done to correctly display the transition of elements*/

  fillContainerWithItems(cloneContainer, replacingItems);

  await new Promise(resolve => {
    this.addClassesToItems(visibleItems, 'transparent');

    this.addArrowsToItem(lastReplacingItem);

    setTimeout(resolve, this.transitionDuration);
  });

  await new Promise(resolve => {
    this.removeClassesFromItems(visibleItems, 'visible');

    this.addClassesToItems(replacingItems, 'visible');
    this.removeClassesFromItems(replacingItems, 'transparent');

    fillContainerWithItems(serviceGridContainer, replacingItems);
    cloneContainer.remove();

    this.removeArrowsFromItem(lastVisibleItem);
    lastVisibleItem.onMouseLeave();

    setTimeout(resolve, this.transitionDuration);
  });


}