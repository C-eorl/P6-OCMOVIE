import {Movie} from "./models.js";

/** Créez de faux film pour initialisation des Sections Autre */
export function getEmptyMovies(count = 6) {
    const emptyMovies = [];
    for (let i = 0; i < count; i++) {
        emptyMovies.push(new Movie(
            "",              // url
            "Film indisponible", // titre par défaut
            "https://via.placeholder.com/150?text=No+Image", // image par défaut
            "Aucune description disponible." // description par défaut
        ));
    }
    return emptyMovies;
}


/** récupère la liste complète des categorie de l'API et la retourne */
export async function getCategories() {
    const response = await fetch("http://127.0.0.1:8000/api/v1/genres/?page_size=25");
    const data = await response.json();
    let categories = []
    data["results"].forEach(category => {
        categories.push(category["name"])
    });

    return categories

}

/** Créez les class Movie grâce à l'url en parametre 
 * retourne une liste de Movies
*/
export async function createMovies(url){
    const data = await getDataMovies(url)
    const movies = []
    for (const dataMovie of data) {
        movies.push(
            new Movie(
                dataMovie["url"],
                dataMovie["title"],
                dataMovie["image_url"],
                dataMovie["description"]
            )
        );
    }
    return movies
}
/**
 * Demande à l'api les info des film
 * @param {String} url 
 * @returns json de tous les films lié à la requete url
 */
async function getDataMovies(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data["results"]
        
    } catch (error) {
        console.error("Erreur:", error);
        return null;
    }
}