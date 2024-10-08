const urlParams = new URLSearchParams(window.location.search);
const gameIndex = urlParams.get('game');

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

    const game = data.games[gameIndex];
    if (!game) {
      throw new Error('Game not found');
    }

    document.getElementById('game-title').innerText = game.title;

    const coverImageUrl = `https://drive.google.com/thumbnail?id=${game.coverImageId}&sz=w300-h450`;
    const gameCover = document.getElementById('game-cover');
    gameCover.src = coverImageUrl;
    gameCover.alt = game.title;

    const downloadButton = document.getElementById('download-button');
    downloadButton.onclick = function() {
      const downloadUrl = `https://drive.google.com/uc?export=download&id=${game.fileId}`;
      window.location.href = downloadUrl;
    };
  })
  .catch(error => {
    console.error('Error fetching JSON data:', error);
    const gameDetails = document.getElementById('game-details');
    gameDetails.innerHTML = `<p>Sorry, an error occurred while loading the game. Please try again later.</p>`;
  });
