const API_KEY = 'c9c74620'; 

$(document).ready(function () {
  $('#search-form').on('submit', function (e) {
    e.preventDefault();
    searchMovies(1);
  });

  function searchMovies(page) {
    const title = $('#title').val();
    const type = $('#type').val();

    $.ajax({
      url: `https://www.omdbapi.com/?apikey=${API_KEY}&s=${title}&type=${type}&page=${page}`,
      method: 'GET',
      success: function (data) {
        $('#details').empty(); 
        if (data.Response === "True") {
          renderMovies(data.Search);
          renderPagination(data.totalResults, page);
        } else {
          $('#results').html('<p>Movie not found!</p>');
          $('#pagination').empty();
        }
      }
    });
  }

  function renderMovies(movies) {
    let html = '';
    movies.forEach(movie => {
      html += `
        <div class="movie">
          <strong>${movie.Title}</strong> (${movie.Year})
          <button class="details-btn" data-id="${movie.imdbID}">Details</button>
        </div>
      `;
    });
    $('#results').html(html);
  }

  function renderPagination(totalResults, currentPage) {
    const pages = Math.ceil(totalResults / 10);
    let html = '';
    for (let i = 1; i <= pages; i++) {
      html += `<button class="page-btn" data-page="${i}">${i}</button>`;
    }
    $('#pagination').html(html);

    $('.page-btn').on('click', function () {
      const page = $(this).data('page');
      searchMovies(page);
    });
  }

  $(document).on('click', '.details-btn', function () {
    const imdbID = $(this).data('id');
    $.ajax({
      url: `https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}&plot=full`,
      method: 'GET',
      success: function (data) {
        if (data.Response === "True") {
          $('#details').html(`
            <h3>${data.Title} (${data.Year})</h3>
            <p><strong>Genre:</strong> ${data.Genre}</p>
            <p><strong>Director:</strong> ${data.Director}</p>
            <p><strong>Actors:</strong> ${data.Actors}</p>
            <p><strong>Plot:</strong> ${data.Plot}</p>
            <img src="${data.Poster !== "N/A" ? data.Poster : ''}" alt="Poster" width="200">
          `);
        }
      }
    });
  });
});
