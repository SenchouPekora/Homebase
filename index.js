const jsonBinUrl = 'https://api.jsonbin.io/v3/b/66fcb61aad19ca34f8b1445a/latest';

const fetchOptions = {
  headers: {
  },
  cache: 'no-store'
};

fetch(jsonBinUrl, fetchOptions)
  .then(response => {
    if (!response.ok) {
      throw new Error(`Network response was not ok. Status: ${response.status}`);
    }
    return response.json();
  })
  .then(json => {
    const data = json.record;
    loadTVMovies(data.tvMovies);
    loadGames(data.games);
  })
  .catch(error => {
    console.error('Error fetching JSON data:', error);
    document.getElementById('series-container').innerHTML = `<p>Sorry, an error occurred while loading the TV & Movies.</p>`;
    document.getElementById('games-container').innerHTML = `<p>Sorry, an error occurred while loading the Games.</p>`;
  });

function loadTVMovies(tvMoviesData) {
  const container = document.getElementById('series-container');
  tvMoviesData.forEach((categoryObj, categoryIndex) => {
    const categorySection = document.createElement('div');
    categorySection.classList.add('category-section');

    const categoryTitle = document.createElement('h2');
    categoryTitle.innerText = categoryObj.category;
    categoryTitle.style.fontStyle = 'italic';
    categorySection.appendChild(categoryTitle);

    const seriesContainer = document.createElement('div');
    seriesContainer.classList.add('series-container');

    categoryObj.series.forEach((series, seriesIndex) => {
      const seriesDiv = document.createElement('div');
      seriesDiv.classList.add('series-item');

      const coverImageUrl = `https://drive.google.com/thumbnail?id=${series.coverImageId}&sz=w300-h450`;

      seriesDiv.innerHTML = `
        <img src="${coverImageUrl}" alt="${series.title}" onclick="openSeries(${categoryIndex}, ${seriesIndex})">
        <h3>${series.title}</h3>
      `;
      seriesContainer.appendChild(seriesDiv);
    });

    categorySection.appendChild(seriesContainer);

    container.appendChild(categorySection);
  });
}

function loadGames(gamesData) {
  const container = document.getElementById('games-container');
  gamesData.forEach((game, gameIndex) => {
    const gameDiv = document.createElement('div');
    gameDiv.classList.add('series-item');

    const coverImageUrl = `https://drive.google.com/thumbnail?id=${game.coverImageId}&sz=w300-h450`;

    gameDiv.innerHTML = `
      <img src="${coverImageUrl}" alt="${game.title}" onclick="openGame(${gameIndex})">
      <h3>${game.title}</h3>
    `;
    container.appendChild(gameDiv);
  });
}

function openTab(evt, tabName) {
  var i, tabcontent, tabs;

  tabcontent = document.getElementsByClassName("tab-content");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
    tabcontent[i].classList.remove("active");
  }

  tabs = document.getElementsByClassName("tab");
  for (i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove("active");
  }

  document.getElementById(tabName).style.display = "block";
  document.getElementById(tabName).classList.add("active");
  evt.currentTarget.classList.add("active");
}

function openSeries(categoryIndex, seriesIndex) {
  window.location.href = `series.html?category=${categoryIndex}&series=${seriesIndex}`;
}

function openGame(gameIndex) {
  window.location.href = `game.html?game=${gameIndex}`;
}
