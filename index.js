let artworkData = {
  all: []
};
let shuffledCategoryData = [];
let artworkPage = 0;
const artworkPerPage = 20;
let loadingArtwork = false;

document.addEventListener('DOMContentLoaded', () => {
  fetchMainData();
  fetchArtworkData();
  setDefaultTab();
});

function fetchMainData() {
  const jsonBinUrl = 'https://api.jsonbin.io/v3/b/66fcb61aad19ca34f8b1445a/latest';

  const fetchOptions = {
    headers: {},
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
}

function fetchArtworkData() {
  const artworkJsonUrl = 'artwork.json';

  fetch(artworkJsonUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Artwork data fetch failed. Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      artworkData.all = [...(data.safe || []), ...(data.other || [])];
      shuffledCategoryData = shuffleArray([...artworkData.all]);
    })
    .catch(error => {
      console.error('Error fetching artwork data:', error);
      document.getElementById('artwork-container').innerHTML = `<p>Sorry, an error occurred while loading the Artwork.</p>`;
    });
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

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
      const seriesItem = document.createElement('div');
      seriesItem.classList.add('series-item');

      const coverImageUrl = `https://drive.google.com/thumbnail?id=${series.coverImageId}&sz=w300-h450`;

      seriesItem.innerHTML = `
        <img src="${coverImageUrl}" alt="${series.title}" onclick="openSeries(${categoryIndex}, ${seriesIndex})">
        <h3>${series.title}</h3>
      `;
      seriesContainer.appendChild(seriesItem);
    });

    categorySection.appendChild(seriesContainer);
    container.appendChild(categorySection);
  });
}

function loadGames(gamesData) {
  const container = document.getElementById('games-container');
  gamesData.forEach((game, gameIndex) => {
    const gameItem = document.createElement('div');
    gameItem.classList.add('series-item');

    const coverImageUrl = `https://drive.google.com/thumbnail?id=${game.coverImageId}&sz=w300-h450`;

    gameItem.innerHTML = `
      <img src="${coverImageUrl}" alt="${game.title}" onclick="openGame(${gameIndex})">
      <h3>${game.title}</h3>
    `;
    container.appendChild(gameItem);
  });
}

function openSeries(categoryIndex, seriesIndex) {
  window.location.href = `series.html?category=${categoryIndex}&series=${seriesIndex}`;
}

function openGame(gameIndex) {
  window.location.href = `game.html?game=${gameIndex}`;
}

function openTab(evt, tabName) {
  var i, tabcontent, tabs;

  tabcontent = document.getElementsByClassName('tab-content');
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = 'none';
    tabcontent[i].classList.remove('active');
  }

  tabs = document.getElementsByClassName('tab');
  for (i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove('active');
  }

  var homepage = document.getElementById('homepage');
  if (homepage) {
    homepage.style.display = 'none';
  }

  var tabContentElement = document.getElementById(tabName);
  if (tabContentElement) {
    tabContentElement.style.display = 'block';
    tabContentElement.classList.add('active');
  }
  if (evt && evt.currentTarget) {
    evt.currentTarget.classList.add('active');
  }

  if (tabName === 'Artwork' && artworkPage === 0) {
    loadMoreArtwork();
  }
}

function setDefaultTab() {
  var tabs = document.getElementsByClassName('tab');
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove('active');
  }

  var tabContents = document.getElementsByClassName('tab-content');
  for (var i = 0; i < tabContents.length; i++) {
    tabContents[i].style.display = 'none';
    tabContents[i].classList.remove('active');
  }

  // Show the homepage content
  var homepage = document.getElementById('homepage');
  if (homepage) {
    homepage.style.display = 'block';
  }
}

function loadMoreArtwork() {
  if (loadingArtwork) return;
  loadingArtwork = true;

  const container = document.getElementById('artwork-container');

  const startIndex = artworkPage * artworkPerPage;
  const endIndex = startIndex + artworkPerPage;
  const artworksToLoad = shuffledCategoryData.slice(startIndex, endIndex);

  if (artworksToLoad.length === 0) {
    if (artworkPage === 0) {
      container.innerHTML = '<p>No images available.</p>';
    }
    loadingArtwork = false;
    return;
  }

  artworksToLoad.forEach(imageId => {
    const postDiv = document.createElement('div');
    postDiv.classList.add('artwork-post');  // Correct classList

    const img = document.createElement('img');
    img.src = `https://drive.google.com/thumbnail?id=${imageId}&sz=w600-h600`;
    img.alt = 'Artwork Image';
    img.classList.add('artwork-image');

    img.onclick = () => {
      const fullResUrl = `https://drive.google.com/uc?id=${imageId}`;
      window.open(fullResUrl, '_blank');
    };

    const downloadButton = document.createElement('button');
    downloadButton.classList.add('download-button');
    downloadButton.innerText = 'Download';
    downloadButton.onclick = () => downloadImage(imageId);

    postDiv.appendChild(img);
    postDiv.classList.add('download-button'); // Incorrect, should be postDiv.appendChild(downloadButton);
    postDiv; // This line is unnecessary and incorrect

    container.appendChild(postDiv); // Should be container.appendChild(postDiv(postDiv is invalid)
  });

  artworkPage++;
  loadingArtwork = false;
}

window.addEventListener('scroll', () => {
  const artworkTab = document.getElementById('Artwork');
  if (artworkTab && artworkTab.classList.contains('active')) {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= documentHeight - 200) {
      loadMoreArtwork();
    }
  }
});

function downloadImage(imageId) {
  const downloadUrl = `https://drive.google.com/uc?export=download&id=${imageId}`;
  window.location.href = downloadUrl;
}
