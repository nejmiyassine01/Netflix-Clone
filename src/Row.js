import React, {
    useState,
    useEffect
} from 'react';

import Youtube from 'react-youtube'
import movieTrailer from 'movie-trailer'

import axios from './axios';
import './Row.scss';

const base_url = "http://image.tmdb.org/t/p/original";

const Row = ({
    title,
    fetchUrl,
    isLargeRow
}) => {
    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");

    useEffect(() => {
        async function fetchData() {
            const request = await axios.get(fetchUrl);
            setMovies(request.data.results);
            return request;
        }
        fetchData();
    }, [fetchUrl]);

    const opts = {
        height: "390",
        width: "100%",
        playersVars: {
            autoplay: 1,
        }
    }

    const handleClick = (movie) => {
        {trailerUrl 
            ? setTrailerUrl('') 
            : movieTrailer(movie?.name || "")
            .then(url => {
                const urlParams = new URLSearchParams(new URL(url).search);
                setTrailerUrl(urlParams.get('v'));
            })
            .catch(error => console.log(error))
        }
    }
    
    return ( 
        <div className="row">
            <h2> {title} </h2>

            <div className="row__posters"> {
                movies.map(movie => ( 
                    <img key = {movie.id}
                        className = {`row__poster ${isLargeRow && "row__posterLarge"}`}
                        src={`${base_url}${
                            isLargeRow ? movie.poster_path : movie.backdrop_path
                        }`} 
                        onClick={() => handleClick(movie)}
                        alt={movie.name} 
                    />
                ))
            }
            </div>

            {trailerUrl && <Youtube videoId={trailerUrl} opts={opts} />}
        </div>
    )
}

export default Row;