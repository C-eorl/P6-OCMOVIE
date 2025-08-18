export class Section {
    constructor(title, id, movies, categories = null) {
        this.id = id;
        this.title = title;
        this.className = "category";
        this.movies = movies;       // Liste d'objets Movie
        this.categories = categories; // Liste de {id, name} ou null
    }

    constructorDOM() {
        const section = document.createElement("section");
        section.id = this.id;
        section.className = this.className;

        if (this.categories && this.categories.length > 0) {
            // Cas avec <select>
            const header = document.createElement("div");
            header.className = "header-category";

            const h2 = document.createElement("h2");
            h2.textContent = this.title;

            const select = document.createElement("select");
            this.categories.forEach(cat => {
                const option = document.createElement("option");
                option.textContent = cat;
                select.appendChild(option);
            });

            // --- LOGIQUE DU SELECT ---
            select.addEventListener("change", async (e) => {
                const categoryName = e.target.value;
                console.log("Catégorie sélectionnée :", categoryName);

                const url = `http://127.0.0.1:8000/api/v1/titles/?genre=${categoryName}&sort_by=-imdb_score&page_size=6`;
                const newMovies = await createMovie(url);

                // ⚡️ Mettre à jour le carousel avec les nouveaux films
                section.querySelector(".carousel").replaceWith(
                    new Carousel(newMovies.length, newMovies).constructorDOM()
                );
            });

            header.appendChild(h2);
            header.appendChild(select);
            section.appendChild(header);
        } else {
            // Cas sans <select>
            const h2 = document.createElement("h2");
            h2.textContent = this.title;
            section.appendChild(h2);
        }

        // Ajout du carousel initial
        const carousel = new Carousel(this.movies.length, this.movies);
        const carouselDOM = carousel.constructorDOM();
        carouselDOM.classList.add("carousel"); // utile pour le remplacer plus tard
        section.appendChild(carouselDOM);

        return section;
    }
}


export class Carousel {
    constructor(nbCardMovies = 6, movies = []) {
        this.nbCardMovies = nbCardMovies;
        this.movies = movies;
    }

    constructorDOM() {
        const div = document.createElement("div");
        div.className = "carousel";

        for (let i = 0; i < this.nbCardMovies; i++) {
            const movie = this.movies[i];
            const card = new CardMovie(movie);
            div.appendChild(card.constructorDOM());
        }

        return div;
    }
}

export class CardMovie {
    constructor(movie) {
        this.movie = movie;
    }

    constructorDOM() {
        const div = document.createElement("div");
        div.className = "card-movie";

        const img = document.createElement("img");
        img.src = this.movie.urlImg;
        img.alt = this.movie.title;
        img.addEventListener("error", () => {
            img.src = "https://placehold.co/300?text=No+Image";
        });

        const overlay = document.createElement("div");
        overlay.className = "overlay";

        const h3 = document.createElement("h3");
        h3.className = "title";
        h3.textContent = this.movie.title;

        const button = document.createElement("button");
        button.className = "details-btn";
        button.textContent = "Détails";

        div.appendChild(img);
        div.appendChild(overlay);
        overlay.appendChild(h3);
        overlay.appendChild(button);

        return div;
    }
}

export class Movie {
    constructor(url, title, urlImg, description) {
        this.url = url;
        this.title = title;
        this.urlImg = urlImg;
        this.description = description;
    }
}

/** Créez les class Movie grâce à l'url en parametre */
export async function createMovie(url){
    const data = await getMovies(url)
    const movies = []
    for (const dataMovie of data) {
        movies.push(
            new Movie(
                dataMovie["url"],
                dataMovie["title"],
                dataMovie["image_url"],
            )
        );
    }
    return movies
}

export async function getMovies(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data["results"]
        
    } catch (error) {
        console.error("Erreur:", error);
        return null;
    }
}