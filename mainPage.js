let pageNumber = 0;
// console.log(`LocalStorage ==`, localStorage[`page`]);

document.body.onload = function () {
  // console.log(`bpdy was loaded norm`);
}

//Для сохранения значений элементов selectors
window.onbeforeunload = function () {
  localStorage[`return`] = true;
};


async function getGameApi(url, gameNumber) {

  // const rapidUrl = 'https://free-to-play-games-database.p.rapidapi.com/api/filter?tag=3d.mmorpg.fantasy.pvp&platform=pc';
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '7da3ded902mshdeabc997246b249p1758f9jsn618b5d73fa13',
      'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com'
    }
  };
let game;
  try {
    const response = await fetch(url, options);
    game = await response.json();
    console.log(game);
  } catch (error) {
    console.error(error);
  }

  let a = '.game-' + gameNumber + ' ';
  let release_rus_date = game[gameNumber + pageNumber * 6 - 1].release_date.slice(8, 10) + game[gameNumber + pageNumber * 6 - 1].release_date.slice(4, 8) + game[gameNumber + pageNumber * 6 - 1].release_date.slice(0, 4);
  document.querySelector(`${a} .game-name`).textContent = game[gameNumber + pageNumber * 6 - 1].title;
  document.querySelector(`${a} .relis-date`).textContent = release_rus_date;
  document.querySelector(`${a} .publisher`).textContent = game[gameNumber + pageNumber * 6 - 1].publisher;
  document.querySelector(`${a} .genre`).textContent = game[gameNumber + pageNumber * 6 - 1].genre;
  document.querySelector(`${a} .thumbnail`).src = game[gameNumber + pageNumber * 6 - 1].thumbnail;
  document.querySelector(`${a} .invis`).textContent = game[gameNumber + pageNumber * 6 - 1].id;
  let pageCount = Math.ceil(game.length / 6);
  document.querySelector(`.page-number`).textContent = (pageNumber + 1) + " / " + (pageCount);
}

function urlGenerator(isChanged) {

  //Создание URL адреса для взаимодействия с api
  let url = 'https://free-to-play-games-database.p.rapidapi.com/api/games?platform=';

  //возвращение значений selectors после возвращения или рефреша страницы
  if (localStorage[`return`] == "true") {
    document.querySelector(`.select-platform`).value = localStorage[`pl`];
    document.querySelector(`.select-genre`).value = localStorage[`ge`];
    document.querySelector(`.sort-selected`).value = localStorage[`so`];
  }
  //нормальный код
  let platform = document.querySelector(`.select-platform`).value;
  let genre = document.querySelector(`.select-genre`).value;
  let sort = document.querySelector(`.sort-selected`).value;
  //сохраняем данные для возврата и рефреша 
  {
    localStorage[`pl`] = platform;
    localStorage[`ge`] = genre;
    localStorage[`so`] = sort;
  }

  sort = '&sort-by=' + sort;
  if (genre != "all") {
    genre = "category=" + genre;
    platform = platform + "&";
    url = url + platform + genre + sort;
  } else {
    url = url + platform + sort;
  }

  //При обновлении селектора категории возвращаемся на 0 страницу
  if (isChanged) {
    pageNumber = 0;
    localStorage[`page`] = 0;
    localStorage[`return`] = false;
    isChanged = false;
  }

  //Если в локале была страница, то мы ее восстанавливаем, чтобы не возвращаться в начало и при рефреше страницы
  if ((localStorage[`page`] != null) & (localStorage[`page`] != 0)) {
    pageNumber = Number(localStorage[`page`]);
  }

  // console.log(localStorage[`return`]);
  if (localStorage[`return`] == "true") {
    pageNumber = Number(localStorage[`page`]);
    url = localStorage[`url`];
    localStorage[`return`] = false;
  }
  else {
    localStorage[`url`] = url;
  }

  for (let i = 1; i < 7; i++) {
    getGameApi(url, i);
  }

  return url;
}

let url = urlGenerator(false);

function relocate(gameNumber) {
  let a = '.game-' + gameNumber + ' ';
  localStorage['eachGame'] = 'https://free-to-play-games-database.p.rapidapi.com/api/game?id=' + document.querySelector(`${a} .invis`).textContent;
  console.log('localStorage[eachGame] == ', localStorage['eachGame'])
  window.location.href = 'eachGame.html';
}

function nextPage() {
  let pageCount = document.querySelector(`.page-number`).textContent;
  pageCount = Number(pageCount.slice(pageCount.indexOf(" / ") + 3));
  if (pageNumber < pageCount - 1) {
    pageNumber += 1;
    localStorage[`page`] = pageNumber;
    urlGenerator();
  }
}

function prevPage() {
  if (pageNumber != 0) {
    pageNumber -= 1;
    localStorage[`page`] = pageNumber;
    urlGenerator();
  }
}

