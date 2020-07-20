import React, {useState, useEffect} from "react"
import {instance} from './axios'
import axios from "axios"

import "./Row.css"
import YouTube from "react-youtube"
import movieTrailer from "movie-trailer"

const base_url = "https://image.tmdb.org/t/p/original"


function Row({title, fetchUrl, isLargeRow}){

	const [movies, setMovies] = useState([])
	const [trailerUrl, setTrailerUrl] = useState("")
	const [message, setMessage] = useState("")
	useEffect(() => {
		async function fetchData(){
			const request = await instance.get(fetchUrl)
			setMovies(request.data.results)
			return request
		}
		fetchData() // when we have async fun

	}, [fetchUrl])  // fetchUrl as dependancy because it is from outside the block i.e useEffect


	const opts = {
		height: "390",
		width: "100%",
		playerVars: {
			autoplay: 1,
		},
	}

	const handleClick = (movie) =>{
		if (trailerUrl || message) {
			setTrailerUrl('')
			setMessage('')
		}else{
			axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=49b448bd801f342d60a187eeb5939faf`)
				.then(resp => {
					if (resp.data.results[0]) {
			    		setTrailerUrl(resp.data.results[0]['key'])
					}else{
						setMessage("Sorry trailer is not available at this momemt. Thank You.")
					}
				})
				.catch((error) =>{
					console.log('First Error ='+error)
					movieTrailer(movie?.name || "")
					.then((url) => {
						const urlParams = new URLSearchParams(new URL(url).search)
						setTrailerUrl(urlParams.get('v'))
					})
					.catch((error)=>{ 
						console.log(error)
						setMessage("Sorry trailer is not available at this momemt. Thank You.")
						})
					})
		}
	}

	return(
		<div className='row'>
			<h2>{title}</h2>

			<div className='row__posters'>
				{movies.map(movie => (
					<img 
					key={movie.id}
					onClick ={() => handleClick(movie)}
					className={`row__poster ${isLargeRow && "row__posterLarge"}`}
					src={`${base_url}${isLargeRow? movie.poster_path: movie.backdrop_path}`}
					alt={movie.name}/>
				))}
			</div>

			{trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
					
			{message && <h3 className="message">{message}</h3>}
		</div>

	)
}

export default Row