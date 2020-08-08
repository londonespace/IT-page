let feedbackQuotes = document.getElementById('feedback-quotes');
let feedbackArrowLeft = document.getElementById('feedback-arrow-left');
let feedbackArrowRight = document.getElementById('feedback-arrow-right');
let feedbackCounter = document.getElementById('feedback-counter');

feedbackQuotes.numOfVisibleQuote = 0;
feedbackQuotes.countOfQuotes = 10;
feedbackQuotes.transitionDuration = 800;
feedbackQuotes.isAnimating = false;

feedbackQuotes.onclick = function () {
  let arrow = event.target.closest('.arrow-90');
  if (!arrow || this.isAnimating) return;

  let numOfReplacingQuote = this.calculateNumOfReplacingQuote(event);

  feedbackCounter.replaceCount(numOfReplacingQuote);
  this.replaceQuote(numOfReplacingQuote);
};

feedbackQuotes.replaceQuote = async function (numOfReplacingQuote) {
  let visibleQuote = this.selectQuote(this.numOfVisibleQuote);
  let replacingQuote = this.selectQuote(numOfReplacingQuote);

  feedbackQuotes.numOfVisibleQuote = numOfReplacingQuote;

  this.isAnimating = true;

  await fadeOut(visibleQuote, this.transitionDuration);
  await fadeIn(replacingQuote, this.transitionDuration);

  this.isAnimating = false;
};

feedbackQuotes.calculateNumOfReplacingQuote = function (event) {
  let numOfReplacingQuote;

  if (event.target === feedbackArrowLeft) {
    numOfReplacingQuote = (feedbackQuotes.numOfVisibleQuote - 1
      + feedbackQuotes.countOfQuotes) % feedbackQuotes.countOfQuotes;
  }

  if (event.target === feedbackArrowRight) {
    numOfReplacingQuote = (feedbackQuotes.numOfVisibleQuote + 1)
      % feedbackQuotes.countOfQuotes;
  }

  return numOfReplacingQuote;
};

feedbackCounter.replaceCount = function (number) {
  feedbackCounter.textContent = `${number + 1}/10`;
};

feedbackQuotes.selectQuote = function (number) {
  return feedbackQuotes.querySelector(`.content-${number + 1}`);
};