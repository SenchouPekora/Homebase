const urlParams = new URLSearchParams(window.location.search);
const categoryIndex = urlParams.get('category');
const seriesIndex = urlParams.get('series');

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

    const tvMoviesData = data.tvMovies;

    const categoryObj = tvMoviesData[categoryIndex];
    if (!categoryObj) {
      throw new Error('Category not found');
    }

    const series = categoryObj.series[seriesIndex];
    if (!series) {
      throw new Error('Series not found');
    }

    document.getElementById('series-title').innerText = series.title;

    const episodeList = document.getElementById('episode-list');
    series.episodes.forEach((episode, index) => {
      const btn = document.createElement('button');
      btn.innerText = episode.title;
      btn.onclick = (event) => loadEpisode(episode, index, event);
      episodeList.appendChild(btn);
    });

    loadEpisode(series.episodes[0], 0);
  })
  .catch(error => {
    console.error('Error fetching JSON data:', error);
    const seriesDetails = document.getElementById('series-details');
    seriesDetails.innerHTML = `<p>Sorry, an error occurred while loading the series. Please try again later.</p>`;
  });

function loadEpisode(episode, episodeIndex, event) {
  document.querySelectorAll('#episode-list button').forEach(btn => {
    btn.classList.remove('active');
  });

  if (event && event.target) {
    event.target.classList.add('active');
  } else {
    document.querySelectorAll('#episode-list button')[episodeIndex]?.classList.add('active');
  }

  const videoPlayer = document.getElementById('video-player');
  const embedUrl = `https://drive.google.com/file/d/${episode.videoId}/preview`;

  videoPlayer.innerHTML = `
    <iframe src="${embedUrl}" width="640" height="480" allow="autoplay" frameborder="0" allowfullscreen></iframe>
  `;

  const iframe = videoPlayer.querySelector('iframe');
  iframe.onerror = function() {
    videoPlayer.innerHTML = `<p>Sorry, this video cannot be played at the moment.</p>`;
  };
}
