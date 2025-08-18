import { Movie, Section, createMovie } from "./models.js";

/** Créez de faux film pour initialisation des Section Autre */
function getEmptyMovies(count = 6) {
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


/** récupère la liste complète des categorie de l'API */
async function getCategories() {
    const response = await fetch("http://127.0.0.1:8000/api/v1/genres/?page_size=25");
    const data = await response.json();
    let categories = []
    data["results"].forEach(category => {
        categories.push(category["name"])
    });

    return categories

}
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

        // 4️⃣ Créer la section HTML
    const section = document.createElement("section");
    section.className = "best-movie";

    const h2 = document.createElement("h2");
    h2.textContent = "Meilleur film";
    section.appendChild(h2);

    // 5️⃣ Créer le bloc du film
    const movieDiv = document.createElement("div");
    movieDiv.className = "movie";

    const img = document.createElement("img");
    img.src = bestMovie.urlImg;
    img.alt = bestMovie.title;

    // Gestion de l'erreur si l'image n'existe pas
    img.addEventListener("error", () => {
        img.src = "https://via.placeholder.com/150?text=No+Image";
    });

    const detailsDiv = document.createElement("div");
    detailsDiv.className = "details";

    const titleH2 = document.createElement("h2");
    titleH2.className = "title";
    titleH2.textContent = bestMovie.title;

    const descP = document.createElement("p");
    descP.className = "description";
    descP.textContent = bestMovie.description;

    const btn = document.createElement("button");
    btn.textContent = "Détails";

    detailsDiv.appendChild(titleH2);
    detailsDiv.appendChild(descP);
    detailsDiv.appendChild(btn);

    movieDiv.appendChild(img);
    movieDiv.appendChild(detailsDiv);

    section.appendChild(movieDiv);

    return section
}

/* ====================  Fonction affichant les sections  =============================== */
async function displaySections() {
    
    const sectionBestMovies = new Section(
        "Films les mieux notés",
        "best-movies",
        await createMovie("http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score&page_size=6")
    );
    
    const sectionDrama = new Section(
        "Drama",
        "Drama",
        await createMovie("http://127.0.0.1:8000/api/v1/titles/?genre=Drama&sort_by=-imdb_score&page_size=6")
    );
    const sectionFantasy = new Section(
        "Fantastique",
        "Fantasy",
        await createMovie("http://127.0.0.1:8000/api/v1/titles/?genre=Fantasy&sort_by=-imdb_score&page_size=6"
        )
    );

    const categories = await getCategories()
    const sectionAutres = new Section(
        "Autres:",
        "Autre1",
        getEmptyMovies(),
        categories
    );
    const sectionAutres2 = new Section(
        "Autres:",
        "Autre2",
        getEmptyMovies(),
        categories
    );


    const main = document.querySelector("main");
    const bestSection = await sectionBestMovie()

    main.appendChild(bestSection);
    main.appendChild(sectionBestMovies.constructorDOM());
    main.appendChild(sectionDrama.constructorDOM());
    main.appendChild(sectionFantasy.constructorDOM());
    main.appendChild(sectionAutres.constructorDOM())
    main.appendChild(sectionAutres2.constructorDOM())
}

displaySections()