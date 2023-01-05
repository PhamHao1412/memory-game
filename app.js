const selectors = {
  controls: document.querySelector(".controls"),
  moves: document.querySelector(".moves"),
  timer: document.querySelector(".timer"),
  start: document.querySelector("button"),
  boardContainer: document.querySelector(".board-container"),
  board: document.querySelector(".board"),
  win: document.querySelector(".win"),
};

const state = {
  gameStart: false,
  flippedCard: 0,
  totalFlips: 0,
  totalTime: 0,
  loop: null,
  delay: 1500,
};

const pickRandom = (array, item) => {
  const clonedArray = [...array];
  const randomPicks = [];
  for (let index = 0; index < item; index++) {
    const randomIndex = Math.floor(Math.random() * clonedArray.length);
    randomPicks.push(clonedArray[randomIndex]);
    clonedArray.splice(randomIndex, 1);
  }
  return randomPicks;
};
const shuffle = (array) => {
  const clonedArray = [...array];
  for (let index = clonedArray.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const original = clonedArray[index];
    clonedArray[index] = clonedArray[randomIndex];
    clonedArray[randomIndex] = original;
  }
  return clonedArray;
};

const generateGame = () => {
  const dimensions = selectors.board.dataset.dimension;
  console.log(dimensions);
  if (dimensions % 2 !== 0) {
    throw new Error("The dimension of the board must be an even number.");
  }

  const emojis = ["🐎", "🐇", "🐬", "🐊", "🦅", "🦩", "🐘", "🦏", "🦍", "🐆"];
  // const picks = pickRandom(emojis, (dimensions * dimensions) / 2);
  const picks = pickRandom(emojis, 2);

  const items = shuffle([...picks, ...picks]);
  const card = `
              ${items
                .map(
                  (item) => `
                  <div class="card">
                      <div class="card-front"></div>
                      <div class="card-back">${item}</div>
                  </div>
              `
                )
                .join("")}`;
  selectors.board.innerHTML = card;
};
generateGame();
const resetControl = () => {
  state.totalFlips = 0;
  state.totalTime = 0;
  selectors.moves.innerText = `${state.totalFlips} moves`;
  selectors.timer.innerText = `time: ${state.totalTime} sec`;
};
const startGame = () => {
  state.gameStart = true;
  selectors.start.classList.add("disabled");
  state.loop = setInterval(() => {
    state.totalTime++;
    selectors.moves.innerText = `${state.totalFlips} moves`;
    selectors.timer.innerText = `time: ${state.totalTime} sec`;
  }, state.delay);
};
const flipBackCards = () => {
  document
    .querySelectorAll(".card:not(.matched)")
    .forEach((item) => item.classList.remove("flipped"));
  state.flippedCard = 0;
};

const flipCard = (card) => {
  state.flippedCard++;
  state.totalFlips++;
  if (state.flippedCard <= 2) {
    card.classList.add("flipped");
  }
  if (state.flippedCard === 2) {
    const flippedCard = document.querySelectorAll(".flipped:not(.matched)");
    if (flippedCard[0].innerText === flippedCard[1].innerText) {
      flippedCard[0].classList.add("matched");
      flippedCard[1].classList.add("matched");
    }
    setTimeout(() => {
      flipBackCards();
    }, state.delay);
  }

  if (!document.querySelectorAll(".card:not(.flipped)").length) {
    setTimeout(() => {
      generateGame();
      selectors.boardContainer.classList.add("flipped");
      selectors.win.innerHTML = `
                <span class="win-text">
                    You won!<br />
                    with <span class="highlight">${state.totalFlips}</span> moves<br />
                    under <span class="highlight">${state.totalTime}</span> seconds
                             <button class="play-again">Play again</button>
                </span>`;
      clearInterval(state.loop);
    }, state.delay);
  }
};

const playAgain = () => {
  selectors.boardContainer.classList.remove("flipped");
  selectors.start.classList.remove("disabled");
  document.querySelectorAll(".card").forEach((item) => {
    item.classList.remove("flipped");
    item.classList.remove("matched");
    resetControl();
    clearInterval(state.loop);
  });
};
const attachEventListeners = () => {
  document.addEventListener("click", (e) => {
    const eventTarget = e.target;
    console.log(eventTarget);
    const eventParent = eventTarget.parentElement;
    if (
      eventParent.classList.contains("card") &&
      !eventParent.classList.contains("flipped")
    ) {
      flipCard(eventParent);
    } else if (
      eventTarget.matches(".start") &&
      !eventTarget.className.includes("disabled")
    ) {
      startGame();
    } else if (eventTarget.matches(".play-again")) {
      playAgain();
    }
  });
};
attachEventListeners();
