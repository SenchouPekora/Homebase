// index.js

// Global variables for Artwork
let artworkData = {
  safe: [],
  other: []
};
let currentCategory = 'safe';
let artworkPage = 0;
const artworkPerPage = 20;
let loadingArtwork = false;

// Fetch data and initialize
fetchMainData();
fetchArtworkData(); // Fetch artwork data from the new bin

function fetchMainData() {
  const jsonBinUrl = 'https://api.jsonbin.io/v3/b/66fcb61aad19ca34f8b1445a/latest'; // Replace with your actual main Bin ID

  const fetchOptions = {
    headers: {
      // 'X-Master-Key': 'YOUR_API_KEY' // Include this if your bin is private
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
      // Initialize the tabs with data
      loadTVMovies(data.tvMovies);
      loadGames(data.games);
    })
    .catch(error => {
      console.error('Error fetching JSON data:', error);
      // Handle error for each container
      document.getElementById('series-container').innerHTML = `<p>Sorry, an error occurred while loading the TV & Movies.</p>`;
      document.getElementById('games-container').innerHTML = `<p>Sorry, an error occurred while loading the Games.</p>`;
    });
}

function fetchArtworkData() {
  const artworkBinUrl = 'https://api.jsonbin.io/v3/b/670879c8acd3cb34a894d68d/latest'; // Replace with your actual Artwork Bin ID

  const fetchOptions = {
    headers: {
      // 'X-Master-Key': 'YOUR_ARTWORK_API_KEY' // Include this if your artwork bin is private
    },
    cache: 'no-store'
  };

  fetch(artworkBinUrl, fetchOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Artwork data fetch failed. Status: ${response.status}`);
      }
      return response.json();
    })
    .then(json => {
      const data = json.record;
      artworkData.safe = data.safe || [];
      artworkData.other = data.other || [];
      // Load initial artwork
      loadMoreArtwork();
    })
    .catch(error => {
      console.error('Error fetching artwork data:', error);
      document.getElementById('artwork-container').innerHTML = `<p>Sorry, an error occurred while loading the Artwork.</p>`;
    });
}

// Function to load TV & Movies
function loadTVMovies(tvMoviesData) {
  const container = document.getElementById('series-container');
  tvMoviesData.forEach((categoryObj, categoryIndex) => {
    // Create a category section
    const categorySection = document.createElement('div');
    categorySection.classList.add('category-section');

    // Add category title
    const categoryTitle = document.createElement('h2');
    categoryTitle.innerText = categoryObj.category;
    categoryTitle.style.fontStyle = 'italic';
    categorySection.appendChild(categoryTitle);

    // Create a series container within the category
    const seriesContainer = document.createElement('div');
    seriesContainer.classList.add('series-container');

    categoryObj.series.forEach((series, seriesIndex) => {
      const seriesDiv = document.createElement('div');
      seriesDiv.classList.add('series-item');

      // Construct the image URL using Google Drive thumbnail endpoint
      const coverImageUrl = `https://drive.google.com/thumbnail?id=${series.coverImageId}&sz=w300-h450`;

      seriesDiv.innerHTML = `
        <img src="${coverImageUrl}" alt="${series.title}" onclick="openSeries(${categoryIndex}, ${seriesIndex})">
        <h3>${series.title}</h3>
      `;
      seriesContainer.appendChild(seriesDiv);
    });

    // Add the series container to the category section
    categorySection.appendChild(seriesContainer);

    // Add the category section to the main container
    container.appendChild(categorySection);
  });
}

// Function to load Games
function loadGames(gamesData) {
  const container = document.getElementById('games-container');
  gamesData.forEach((game, gameIndex) => {
    const gameDiv = document.createElement('div');
    gameDiv.classList.add('series-item');

    // Construct the image URL using Google Drive thumbnail endpoint
    const coverImageUrl = `https://drive.google.com/thumbnail?id=${game.coverImageId}&sz=w300-h450`;

    gameDiv.innerHTML = `
      <img src="${coverImageUrl}" alt="${game.title}" onclick="openGame(${gameIndex})">
      <h3>${game.title}</h3>
    `;
    container.appendChild(gameDiv);
  });
}

// Function to open series.html with appropriate indices
function openSeries(categoryIndex, seriesIndex) {
  window.location.href = `series.html?category=${categoryIndex}&series=${seriesIndex}`;
}

// Function to open game.html with appropriate index
function openGame(gameIndex) {
  window.location.href = `game.html?game=${gameIndex}`;
}

// Function to handle tab switching
function openTab(evt, tabName) {
  var i, tabcontent, tabs;

  // Hide all tab contents
  tabcontent = document.getElementsByClassName("tab-content");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
    tabcontent[i].classList.remove("active");
  }

  // Remove "active" class from all tabs
  tabs = document.getElementsByClassName("tab");
  for (i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove("active");
  }

  // Show the selected tab content and add "active" class to the clicked tab
  document.getElementById(tabName).style.display = "block";
  document.getElementById(tabName).classList.add("active");
  evt.currentTarget.classList.add("active");
}

// Function to switch between Safe and Other categories
function switchCategory(category) {
  if (currentCategory === category) return;
  currentCategory = category;
  artworkPage = 0;
  document.getElementById('artwork-container').innerHTML = '';
  // Update button styles
  document.getElementById('safe-button').classList.toggle('active', category === 'safe');
  document.getElementById('other-button').classList.toggle('active', category === 'other');
  // Load artwork for the new category
  loadMoreArtwork();
}

// Function to load more artwork
function loadMoreArtwork() {
  if (loadingArtwork) return;
  loadingArtwork = true;

  const container = document.getElementById('artwork-container');
  const categoryData = artworkData[currentCategory];
  const startIndex = artworkPage * artworkPerPage;
  const endIndex = startIndex + artworkPerPage;
  const artworksToLoad = categoryData.slice(startIndex, endIndex);

  // Check if there are images to load
  if (artworksToLoad.length === 0) {
    if (artworkPage === 0) {
      container.innerHTML = `<p>No images available in this category.</p>`;
    }
    loadingArtwork = false;
    return;
  }

  artworksToLoad.forEach(imageId => {
    const postDiv = document.createElement('div');
    postDiv.classList.add('artwork-post');

    const img = document.createElement('img');
    img.src = `https://drive.google.com/thumbnail?id=${imageId}&sz=w600-h400`;
    img.alt = 'Artwork Image';
    img.classList.add('artwork-image');
    img.onclick = () => openImagePopup(imageId);

    const downloadButton = document.createElement('button');
    downloadButton.classList.add('download-button');
    downloadButton.innerText = 'Download';
    downloadButton.onclick = () => downloadImage(imageId);

    postDiv.appendChild(img);
    postDiv.appendChild(downloadButton);
    container.appendChild(postDiv);
  });

  artworkPage++;
  loadingArtwork = false;
}

// Function to handle infinite scrolling
window.addEventListener('scroll', () => {
  const artworkTab = document.getElementById('Artwork');
  if (artworkTab.classList.contains('active')) {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= documentHeight - 200) {
      loadMoreArtwork();
    }
  }
});

// Function to open image popup
function openImagePopup(imageId) {
  const popupOverlay = document.createElement('div');
  popupOverlay.classList.add('popup-overlay');

  const popupContent = document.createElement('div');
  popupContent.classList.add('popup-content');

  const iframe = document.createElement('iframe');
  iframe.src = `https://drive.google.com/file/d/${imageId}/preview`;
  iframe.allowFullscreen = true;

  const closeButton = document.createElement('button');
  closeButton.classList.add('close-button');
  closeButton.innerText = 'Close';
  closeButton.onclick = () => document.body.removeChild(popupOverlay);

  popupContent.appendChild(iframe);
  popupContent.appendChild(closeButton);
  popupOverlay.appendChild(popupContent);
  document.body.appendChild(popupOverlay);
}

// Function to download image
function downloadImage(imageId) {
  const downloadUrl = `https://drive.google.com/uc?export=download&id=${imageId}`;
  window.location.href = downloadUrl;
}
