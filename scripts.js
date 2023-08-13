const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2YTg5Mjg1YjA0MjdkYTI5NjZmZWYwZDE4NjYyODAyZSIsInN1YiI6IjY0ZDQyMmM3MDM3MjY0MDExYzA1YTU4ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RWuUzRQBZ7UNdZxQMgsn51SRXobNUeTeD4ZJiS5xGPU'
  }
}

const titleSite = document.getElementById('title')
const movieList = document.getElementById('movieList')
const genresTag = document.getElementById('searchGenre')
const buttonClear = document.getElementById('clear')
const divSearch = document.getElementById('searchTitleDiv')
const divGenre = document.getElementById('searchGenreDiv')
const search = document.getElementById('searchTitle')

async function getDataAPI(options, url, get = '') {
  try {
    let response = await fetch(`https://api.themoviedb.org/3/${url}?${get}&language=pt-BR`, options)
    let moviesData = await response.json()
    return moviesData
  } catch (err) {
    throw err
  }
}

function clearMovieList() {
  const movieElements = document.querySelectorAll('.col')
  const movieArray = Array.from(movieElements)

  movieArray.forEach(element => {
    element.remove()
  });
}

function listPopular() {
  getDataAPI(options, 'movie/popular', 'page=1')
    .then(response => listMovies(response.results, 'Populares'))
    .catch(err => console.error(`Erro ao obter os dados da API: ${err}`))
}

listPopular()

function listMovies(response, textTitle) {
  titleSite.innerText = `- ${textTitle}`

  let index = 0;

  const addMovie = () => {
    if (index < response.length) {
      const element = response[index]

      const card = document.createElement('div')
      card.className = 'col'
      card.innerHTML = `
      <a href='https://www.themoviedb.org/movie/${element.id}' target='_black' class="card mb-3" style="max-width: 540px; border-color: #454545;">
        <div class="row g-0" style="background-color: #454545;">
          <div class="col-md-4" style="display: flex; justify-content: center; align-items: center;">
            <img src="https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${element.poster_path}"
              class="img-fluid rounded-start" alt="${element.title}">
          </div>
          <div class="col-md-8">
            <div class="card-body" style="color: #FFFFFF; height: 100%;">
              <h5 class="card-title" style="font-size: 1.2rem">${element.title}</h5>
              <p class="card-text" style="font-size: 1rem; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 5; -webkit-box-orient: vertical;">${element.overview}</p>
            </div>
          </div>
        </div>
      </a>
      `
      movieList.append(card)

      index++
      setTimeout(addMovie, 150)
    }
  };
  addMovie()
}


getDataAPI(options, 'genre/movie/list')
  .then(response => listGenre(response.genres))
  .catch(err => console.error(`Erro ao obter os dados da API: ${err}`))

function listGenre(response) {
  response.forEach(element => {
    const option = document.createElement('option')

    option.value = element.id
    option.textContent = element.name
    genresTag.append(option)
  })
}

genresTag.addEventListener('change', () => {
  clearMovieList()

  getDataAPI(options, 'discover/movie', `with_genres=${genresTag.value}`)
    .then(response => listMovies(response.results, genresTag.options[genresTag.selectedIndex].textContent))
    .catch(err => console.error(`Erro ao obter os dados da API: ${err}`))

  buttonClear.style = 'display: block'
  divSearch.className = 'col-md-5'
  divGenre.className = 'col-md-5'
  search.value = ''
})

buttonClear.addEventListener('click', () => {
  clearMovieList()
  listPopular()

  buttonClear.style = 'display: none'
  divSearch.className = 'col-md-6'
  divGenre.className = 'col-md-6'
  genresTag.value = 0
})

search.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    clearMovieList()

    buttonClear.style = 'display: none'
    divSearch.className = 'col-md-6'
    divGenre.className = 'col-md-6'
    genresTag.value = 0

    getDataAPI(options, 'search/movie', `query=${encodeURIComponent(search.value)}&include_adult=false&page=1`)
      .then(response => listMovies(response.results, `Buscando por: ${search.value}`))
      .catch(err => console.error(`Erro ao obter os dados da API: ${err}`))
  }
})