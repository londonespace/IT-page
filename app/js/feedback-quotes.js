let feedbackQuotes = document.getElementById('feedback-quotes');
let feedbackArrowLeft = document.getElementById('feedback-arrow-left');
let feedbackArrowRight = document.getElementById('feedback-arrow-right');
let feedbackCounter = document.getElementById('feedback-counter');

feedbackQuotes.numOfCurrentQuote = 0;
feedbackQuotes.countOfQuotes = 10;

feedbackArrowLeft.roundAboutConfig = {
  get numOfReplacingQuote() {
    return (feedbackQuotes.numOfCurrentQuote - 1 + feedbackQuotes.countOfQuotes)
      % feedbackQuotes.countOfQuotes;
  }
};

feedbackArrowRight.roundAboutConfig = {
  get numOfReplacingQuote() {
    return (feedbackQuotes.numOfCurrentQuote + 1)
      % feedbackQuotes.countOfQuotes;
  }
};

feedbackQuotes.addEventListener('click', onClick);

function onClick() {
  let arrow = event.target.closest('.arrow-90');
  if (!arrow) return;

  feedbackCounter.replaceCount(arrow.roundAboutConfig.numOfReplacingQuote);
  replaceQuote(arrow.roundAboutConfig);
}

function replaceQuote(config) {
  let numOfCurrentQuote = feedbackQuotes.numOfCurrentQuote;
  let numOfReplacingQuote = config.numOfReplacingQuote;

  let currentQuote = defineQuote(numOfCurrentQuote);
  let replacingQuote = defineQuote(numOfReplacingQuote);

  currentQuote.classList.add('hidden');
  replacingQuote.classList.remove('hidden');

  feedbackQuotes.numOfCurrentQuote = numOfReplacingQuote;

  function defineQuote(number) {
    return feedbackQuotes.querySelector(`.content-${number + 1}`);
  }
}

feedbackCounter.replaceCount = function (number) {
  feedbackCounter.textContent = `${number + 1}/10`;
};