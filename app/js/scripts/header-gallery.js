let header = document.querySelector('header');
let headerBanner = document.getElementById('header-banner');
let topImagesWrapper = document.getElementById('top-images-wrapper');

header.activeAnimations = {};
header.isAnimating = false;

topImagesWrapper.numOfCurrentImage = 0;
topImagesWrapper.transitionDuration = 2000;

topImagesWrapper.imagesSrc = [
  'background-bg-0.png',
  'background-bg-1.png',
  'background-bg-2.png'
];

let headerArrowLeft = document.getElementById('header-arrow-left');
let headerArrowRight = document.getElementById('header-arrow-right');

headerArrowLeft.roundAboutConfig = {
  get numOfReplacingImage() {
    return (topImagesWrapper.numOfCurrentImage - 1 + 3) % 3;
  },

  get replacingImgStartCordX() {
    return -topImagesWrapper.offsetWidth;
  }
};

headerArrowRight.roundAboutConfig = {
  get numOfReplacingImage() {
    return (topImagesWrapper.numOfCurrentImage + 1) % 3;
  },

  get replacingImgStartCordX() {
    return topImagesWrapper.offsetWidth;
  }
};

header.addEventListener('transitionrun', onTransitionRun);
header.addEventListener('transitionend', onTransitionEnd);

header.onclick = function () {
  let arrow = event.target.closest('.arrow');

  if (header.isAnimating || !arrow) return;

  replaceTopImage(arrow.roundAboutConfig);
  replaceHeaderBannerContent(arrow.roundAboutConfig);
  replaceHeaderBackground(arrow.roundAboutConfig);
};

async function replaceTopImage(config) {
  let numOfCurrentImage = topImagesWrapper.numOfCurrentImage;
  let numOfReplacingImage = config.numOfReplacingImage;

  let currentImage = selectTopImage(numOfCurrentImage);
  let replacingImage = selectTopImage(numOfReplacingImage);

  await new Promise(resolve => {
    replacingImage.style.left = config.replacingImgStartCordX + 'px';
    replacingImage.classList.remove('hidden');

    replacingImage.onload = function () {
      console.log(1);
    }

    currentImage.style.left = -config.replacingImgStartCordX + 'px';
    replacingImage.style.left = 0 + 'px';

    setTimeout(resolve, topImagesWrapper.transitionDuration);
  });

  await new Promise(resolve => {
    topImagesWrapper.numOfCurrentImage = numOfReplacingImage;
    currentImage.classList.add('hidden');
    setTimeout(resolve);
  });

  function selectTopImage(num) {
    if (num === -1) num = 2;

    for (image of topImagesWrapper.children) {
      if (!image.src.includes(num)) continue;
      return image;
    }
  }
}

function replaceHeaderBackground(config) {
  header.classList.remove(`bg-img-${topImagesWrapper.numOfCurrentImage}`);
  header.classList.add(`bg-img-${config.numOfReplacingImage}`);
}

function replaceHeaderBannerContent(config) {
  let currentNumber = topImagesWrapper.numOfCurrentImage;
  let replacingNumber = config.numOfReplacingImage;
  let transitionDuration = topImagesWrapper.transitionDuration / 2;

  let currentContent = headerBanner.querySelector(`.content-${currentNumber}`);
  let replacingContent = headerBanner.querySelector(`.content-${replacingNumber}`);

  currentContent.classList.add('hidden');
  setTimeout(() => replacingContent.classList.remove('hidden'), transitionDuration);
}

function onTransitionRun() {
  if (!isGalleriesTransition(event)) return;

  header.isAnimating = true;
  header.activeAnimations[event.target] = event.propertyName;
}

function onTransitionEnd() {
  if (!isGalleriesTransition(event)) return;

  delete header.activeAnimations[event.target];

  let countOfActiveAnimations = 0;

  for (let prop of Object.keys(header.activeAnimations)) {
    countOfActiveAnimations++;
  }

  if (countOfActiveAnimations === 0) {
    header.isAnimating = false;
  }
}

function isGalleriesTransition(event) {
  let isTopImageTransition = topImagesWrapper.contains(event.target);
  let isBannerTransition = headerBanner.contains(event.target);
  let isBackgroundTransition =
    (event.target === header && event.propertyName === 'background');

  if (isTopImageTransition || isBannerTransition || isBackgroundTransition) {
    return true;
  }

  return false;
}