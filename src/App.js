import React, { useState } from 'react'
import axios from 'axios'
import './App.css';


function App() {
  const [text, setText] = useState("")
  const [pageNo, setPageNo] = useState(1)
  const [movie, setMovie] = useState([])
  const changeText = (event) => {
    // console.log(event);
    setText(event.target.value)
    setPageNo(1)
  }

  const updatePage = (e) => {
    e.preventDefault();
    setPageNo(pageNo + 1);
    getMovie({ preventDefault: () => { } });
  };


  const getMovie = (e) => {
    e.preventDefault();

    axios.get(`https://www.omdbapi.com/?s=${text}&apikey=d954e386&page=${pageNo}`)
      .then((response) => {
        // console.log(response);
        const searchResults = response.data.Search;

        // Make another API call to get the genre of each movie
        const movieDetailsRequests = searchResults.map((result) => {
          return axios.get(`https://www.omdbapi.com/?i=${result.imdbID}&apikey=d954e386`);
        });

        axios.all(movieDetailsRequests)
          .then(axios.spread((...responses) => {
            const moviesWithGenre = responses.map((response, index) => {
              const movieDetails = response.data;
              return {
                imdbID: searchResults[index].imdbID,
                Title: searchResults[index].Title,
                Year: searchResults[index].Year,
                Poster: searchResults[index].Poster,
                Plot: movieDetails.Plot,
                Genre: movieDetails.Genre,
                Actors: movieDetails.Actors
              };
            });

            setMovie(moviesWithGenre);
          }))
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }


  return (
    <div className="Body">
      <nav className="navbar bg-dark" data-bs-theme="dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <img src="https://designsystem.ontario.ca/logos/ontario-logo--desktop.svg" alt="Ontario" height="25" />
          </a>
          <form className="d-flex" role="search" onSubmit={getMovie}>
            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" value={text} onChange={changeText} />
            <button className="btn btn-outline-success" type="submit">Search</button>
          </form>
        </div>
      </nav>

      <div>
        {movie?.length > 0 ? (
          <div className="container my-5" align="center">
            <div className="row my-5">
              {
                movie?.map((value, index) => {
                  return (
                    <div className="col-sm my-3" key={index}>
                      <div className="card" style={{ width: "18rem" }}>
                        <img src={value.Poster} className="card-img-top" alt={value.Title} />
                        <div className="card-body">
                          <h5 className="card-title">{value.Title}</h5>
                          <p className="card-text">{value.Plot}</p>
                        </div>
                        <ul className="list-group list-group-flush">
                          <li className="list-group-item"><b>Year: </b>{value.Year}</li>
                          <li className="list-group-item"><b>Genre: </b>{value.Genre}</li>
                          <li className="list-group-item"><b>Actors: </b>{value.Actors}</li>
                        </ul>
                      </div>
                    </div>
                  )
                })
              }
            </div>
            <button onClick={updatePage}>Next Page</button>
          </div>


        ) : (
          <p></p>
        )}
      </div>


      <footer className="bg-dark text-white py-3" style={{ marginTop: '2rem' }}>
        <p style={{ fontSize: '0.8rem' }}>&copy; 2023 All Things Movie and TV App. All rights reserved.</p>
      </footer>
    </div>


  );
}

export default App;
