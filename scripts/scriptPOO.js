import { Movie, Section, BestSection } from "./models.js";
import { getEmptyMovies, createMovies, getCategories, } from "./utils.js";

/** Demande les données des films trié par score IMDB
 *  Récupère le premier
 *  Récupère les information complete du film
 *  Construit un Objet Movie avec les informations reçut
 *  Retourne l'Objet BestSection
 */
async function sectionBestMovie(){
    const response = await fetch("http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score&page_size=1");
    const data = await response.json();
    const idBestMovie = data["results"][0]["id"];

  
    const res = await fetch(`http://127.0.0.1:8000/api/v1/titles/${idBestMovie}`);
    const databestMovie = await res.json();

    const bestMovie = new Movie(
        databestMovie.url,
        databestMovie.title,
        databestMovie.image_url,
        databestMovie.description,
    )

    return new BestSection(bestMovie)
}

/* ====================  Fonction affichant les sections  =============================== */
async function displaySections() {
    const données = [
        {
            "title" : "Films les mieux notés",
            "id" : "best-movies",
            "movies" : await createMovies("http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score&page_size=6"),
        },
        {
            "title" : "Drama",
            "id" : "Drama",
            "movies" : await createMovies("http://127.0.0.1:8000/api/v1/titles/?genre=Drama&sort_by=-imdb_score&page_size=6"),
        },
        {
            "title" : "Fantastique",
            "id" : "Fantasy",
            "movies" : await createMovies("http://127.0.0.1:8000/api/v1/titles/?genre=Fantasy&sort_by=-imdb_score&page_size=6"), 
        }  
    ]

    const main = document.querySelector("main");
    

    const categories = await getCategories()
    const sectionAutres = new Section(
        "Autres:",
        "Autre1",
        getEmptyMovies(),
        categories
    );
    

    const bestSection = await sectionBestMovie()
    main.appendChild(bestSection.constructorDOM())

    données.forEach(donnée => {
        const section = new Section(
            donnée.title,
            donnée.id,
            donnée.movies
        )
        main.appendChild(section.constructorDOM())
    })

    main.appendChild(sectionAutres.constructorDOM())
}

displaySections()