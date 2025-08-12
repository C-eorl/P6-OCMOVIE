async function getBestFilms() {
    /** Retourne la liste des films triés par imdb */
    try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score");
        const data = await response.json();
        return data["results"]
        
    } catch (error) {
        console.error("Erreur:", error);
        return null;
    }
}


function displayBestMovie() {
    /** Cherche le 1er film de la liste retourner par getBestFilms()
     * Récupère la balise img & les class title, description de la section .best-movie
     * Remplace les données par ceux du film 
     */
    getBestFilms().then(dataBestFilms => {
        const idBestFilm = dataBestFilms[0]["id"];

        return fetch(`http://127.0.0.1:8000/api/v1/titles/${idBestFilm}`);
    })
    .then(response => response.json())
    .then(dataBestFilm => {
        const sectionBestMovie = document.getElementsByClassName("best-movie")[0];

        const title = sectionBestMovie.getElementsByClassName("title")[0];
        title.textContent = dataBestFilm["title"];

        const image = sectionBestMovie.getElementsByTagName("img")[0];
        image.src = dataBestFilm["image_url"];

        const description = sectionBestMovie.getElementsByClassName("description")[0];
        description.textContent = dataBestFilm["description"];
    })
    .catch(error => {
        console.error("Erreur :", error);
    });
}
function displayBestMovies(){
    /** Récupère les 2 premieres page des meilleurs films et les fusionne
     * Récupère la balise image et la class .title pour modifier les donnée
     */
    getBestFilms().then(dataBestFilms => {
        fetch("http://127.0.0.1:8000/api/v1/titles/?page=2&sort_by=-imdb_score")
            .then(response => response.json())
            .then(dataBestFilms_2 => {
                
                const dataAll = [...dataBestFilms, ...dataBestFilms_2["results"]];
                const section = document.getElementById("best-movies")
                const carousel = section.getElementsByClassName("carousel")[0];
        
                for(let i = 1; i < carousel.children.length+1; i++){
                    
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

async function displayCategory(category) {
    /** En parallèle, récupère la page 1 & 2 de la category et fusionne les résultats 
     * Récupère la section de la category
     * Pour chaque cardMovie, remplace le title et l'image
    */
    try {
        const responsePage1 = await fetch(`http://127.0.0.1:8000/api/v1/titles/?genre=${category}&sort_by=-imdb_score`);
        const jsonPage1 = await responsePage1.json();

        const responsePage2 = await fetch(`http://127.0.0.1:8000/api/v1/titles/?genre=${category}&page=2&sort_by=-imdb_score`);
        const jsonPage2 = await responsePage2.json();

        const dataAll = [...jsonPage1.results, ...jsonPage2.results];

        const section = document.getElementById(category)
        const carousel = section.getElementsByClassName("carousel")[0];

        for (let i = 0; i < carousel.children.length; i++) {
            const movie = dataAll[i];
            const cardMovie = carousel.children[i];

            const title = cardMovie.getElementsByClassName("title")[0];
            title.textContent = movie.title;

            const img = cardMovie.getElementsByTagName("img")[0];
            img.src = movie.image_url;
        }
    } catch (error) {
        console.error("Erreur lors de l'affichage de la catégorie :", error);
    }
}

function displaySelectCategory(){
    /** recuperer option du select via id pour differencier */
}

displayBestMovies()
displayBestMovie()
displayCategory("Fantasy")
displayCategory("Drama")