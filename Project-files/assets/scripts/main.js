const addMovieBtn = document.getElementById('add-movie-btn');
const filterBtn = document.getElementById('filter-btn');
const searchBtn = document.getElementById('search-btn');
const latestEntry = document.getElementById('latest-entry');
const validationMessage = document.getElementById('validation-error');
const filterSearchError = document.getElementById('filter-search-error');

const movies = [];

// Add a movie

const addMovieHandler = () => {
  let titleIn = document.getElementById('title');
  let idGenerator = 1;
  let title = titleIn.value;

  const regex = /^[a-zA-Z0-9\s]*$/;


// Input validation
  if (title.trim() === '') {
    validationMessage.style.display="block";
    validationMessage.textContent="Please fill a movie title";
    titleIn.value = '';
  } else if (!regex.test(title)) {
    validationMessage.style.display="block";
    validationMessage.textContent="Please fill a valid title";
    titleIn.value = '';
  } else {
    validationMessage.style.display="none";
    // Movie object
    const newMovie = {
      info: {
        title
      },
      id: idGenerator
    };

    //Clear inputs
    titleIn.value = '';

    movies.push(newMovie);
    idGenerator++;
    latestEntry.textContent = newMovie.info.title;
    console.log(movies);
  }


};


// Filter saved movies

const filterMovieHandler = () => {
  const filterTerm = document.getElementById('filter-title').value;
  const movieList = document.getElementById('movie-list');
  const searchResult = document.getElementById('search-result');

  /*searchResult.style.display="none";*/

  if (movies.length != 0 && movies.filter(movie => movie.info.title.includes(filterTerm))) {
    if (movieList.innerHTML != ''){
      movieList.innerHTML = '';
    }
    movieList.classList.add('visible');
    filterSearchError.style.display="none";
    const filteredMovies = !filterTerm ? movies : movies.filter(movie => movie.info.title.includes(filterTerm));

    filteredMovies.forEach(movie => {
      const movieId = movie.id;
      const movieEl = document.createElement('li');
      const {info} = movie;
      const {title} = info;
      let text = title;
      movieEl.innerHTML=`<p class="filtered-movie text-center p-2 rounded-lg" id="${movieId}">${text}</p>`;
      movieList.append(movieEl);
    });
  } else {
    movieList.classList.remove('visible');
    filterSearchError.style.display="block";
    filterSearchError.textContent= "This movie is not in your list or your list is empty. Add a movie before filtering/searching."
  }
};

// Choose filtered movie

$(document).on('click','#movie-list li p', function() {
    const filteredMovie = $(this).text();
    console.log(filteredMovie);
    $('#filter-title').attr("value", filteredMovie);
    $('#filter-title').text(filteredMovie);
    $('#filter-title').val(filteredMovie);
    $('#movie-list').removeClass('visible');
});

/*const chooseFilteredMovieHandler = () => {
  const filterTerm = document.getElementById('filter-title').value;
  const filteredMovie = document.querySelector().innerText;
  console.log(filterTerm);
  console.log(filteredMovie);

  filterTerm = filteredMovie;
  console.log(filterTerm);
  movieList.classList.remove('visible');
}*/

// Find movie's info

const searchMovieHandler = () => {
  const searchTerm = document.getElementById('filter-title').value;
  console.log(searchTerm);
  const movieList = document.getElementById('movie-list');
  let searchResult = document.getElementById('search-result');
  const apiKey = 29114006;

  movieList.classList.remove('visible');

  if(movies.filter(movie => movie.info.title.includes(searchTerm))) {
    filterSearchError.style.display="none";
    axios.get(`https://www.omdbapi.com/?apikey=${apiKey}&t=${searchTerm}`)
    .then (response => {
      console.log(response);
      if(response.data.Response==='True') {
        const returnTitle = response.data.Title;
        const returnYear = response.data.Year;
        const returnDirector = response.data.Director;
        const returnRuntime = response.data.Runtime;
        const returnActors = response.data.Actors;
        const returnGenre = response.data.Genre;
        const returnRating = response.data.imdbRating;
        const returnPlot = response.data.Plot;
        const returnPoster = response.data.Poster;

        searchResult.style.display="grid";
        searchResult.innerHTML = `
          <div class="movie-poster-container flex justify-center sm:block"><img class="movie-poster self-center sm:self-start" src="${returnPoster}"></div>
          <div class="movie-info-container">
            <h3 class="movie-return-title">${returnTitle} (${returnYear})</h3>
            <p class="movie-return-plot">${returnPlot}</p>
            <div class="director-runtime">
              <p class="movie-director"><span>Director:</span> ${returnDirector}</p>
              <p class="movie-runtime"><span>Runtime:</span> ${returnRuntime}</p>
            </div>
            <div class="actors">
              <p class="movie-actors"><span>Actors: </span>${returnActors}</p>
            </div>
            <div class="genre">
              <p class="movie-genre"><span>Genre: </span>${returnGenre}</p>
            </div>
            <div class="rating">
            <p class="movie-rating"><span>Imdb rating:</span> ${returnRating}</p>
            </div>
          </div>`;
      } else {
        console.log(response);
        searchResult.style.display="block";
        searchResult.innerHTML = '<h3 class="server-error-message">This movie is not in the Omdb database</h3>';
      }
    })
  }else {
    filterSearchError.style.display="block";
    filterSearchError.textContent="Sorry, this movie is not in your list. Add a movie before filtering/searching.";
  }
};

addMovieBtn.addEventListener('click', addMovieHandler);
filterBtn.addEventListener('click', filterMovieHandler);
searchBtn.addEventListener('click', searchMovieHandler);

