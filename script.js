async function getBestFilms() {
    try {
        /** Récupère l'id du film avec le meilleur score IMBD */
        const response = await fetch("http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score");
        const data = await response.json();
        return data["results"]
        
    } catch (error) {
        console.error("Erreur:", error);
        return null;
    }
}


function displayBestMovie() {
    getBestFilms().then(dataBestFilms => {
        const idBestFilm = dataBestFilms[0]["id"];

        return fetch(`http://127.0.0.1:8000/api/v1/titles/${idBestFilm}`);
    })
    .then(response => response.json())
    .then(dataBestFilm => {
        const section_best_movie = document.getElementsByClassName("best-movie")[0];

        const title = section_best_movie.getElementsByClassName("title")[0];
        title.textContent = dataBestFilm["title"];

        const image = section_best_movie.getElementsByTagName("img")[0];
        image.src = dataBestFilm["image_url"];

        const description = section_best_movie.getElementsByClassName("description")[0];
        description.textContent = dataBestFilm["description"];
    })
    .catch(error => {
        console.error("Erreur :", error);
    });
}
function displayBestMovies(){
    getBestFilms().then(dataBestFilms => {
        fetch("http://127.0.0.1:8000/api/v1/titles/?page=2&sort_by=-imdb_score")
            .then(response => response.json())
            .then(dataBestFilms_2 => {
                
                const dataAll = [...dataBestFilms, ...dataBestFilms_2["results"]];
                const carousel = document.getElementsByClassName("carousel")[0];
        
                for(let i = 1; i < dataAll.length+1; i++){
                    
                    const movie = dataAll[i] ;
                    const cardMovie = carousel.children[i-1];

                    const title = cardMovie.getElementsByClassName("title")[0];
                    title.textContent = movie["title"];

                    const img = cardMovie.getElementsByTagName("img")[0];
                    img.src = movie["image_url"];
                }
        })
    });
    }

function displayCategory(){
    /** Marche pas  */
    const dataPage1 = fetch("http://127.0.0.1:8000/api/v1/titles/?genre=Drama&sort_by=-imdb_score")["results"];
    const dataPage2 = fetch("http://127.0.0.1:8000/api/v1/titles/?genre=Drama&page=2&sort_by=-imdb_score")["results"];

    const dataAll = [...dataPage1, ...dataPage2]
    const carousel = document.getElementsByClassName("carousel")[1]
    console.log
    for(let i =0; 1 < dataAll.length; i++){
        const movie = dataAll[i] ;
        const cardMovie = carousel.children[i-1];

        const title = cardMovie.getElementsByClassName("title")[0];
        title.textContent = movie["title"];

        const img = cardMovie.getElementsByTagName("img")[0];
        img.src = movie["image_url"];
    }
}

displayBestMovies()
displayBestMovie()
displayCategory()