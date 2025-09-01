/** Objet Section "Meilleur film" parametre (Class: Movie) */
import { createMovies } from "./utils.js";

export class BestSection {
    constructor(movie){
        this.movie = movie
    }
    /** Construit la section puis la retourne */
    constructorDOM(){
        const section = document.createElement("section");
        section.className = "best-movie";

        const h2 = document.createElement("h2");
        h2.textContent = "Meilleur film";
        section.appendChild(h2);

        const movieDiv = document.createElement("div");
        movieDiv.className = "movie";

        const img = document.createElement("img");
        img.src = this.movie.urlImg;
        img.alt = this.movie.title;


        img.addEventListener("error", () => {
            img.src = "https://via.placeholder.com/150?text=No+Image";
        });

        const detailsDiv = document.createElement("div");
        detailsDiv.className = "details";

        const titleH2 = document.createElement("h2");
        titleH2.className = "title";
        titleH2.textContent = this.movie.title;

        const descP = document.createElement("p");
        descP.className = "description";
        descP.textContent = this.movie.description;

        const btn = document.createElement("button");
        btn.textContent = "Détails";
        btn.addEventListener("click", () => {
            const modal = new Modal(this.movie.url);
            modal.open();
        });

        detailsDiv.appendChild(titleH2);
        detailsDiv.appendChild(descP);
        detailsDiv.appendChild(btn);

        movieDiv.appendChild(img);
        movieDiv.appendChild(detailsDiv);

        section.appendChild(movieDiv);

        return section
    }
}

/** Objet général Section parametre: (title: String, id: Int, movies: List(Class:Movie), categories: null || List(String)) */
export class Section {
    constructor(title, movies, categories = null) {
        this.title = title;
        this.className = "category";
        this.movies = movies;       // Liste d'objets Movie
        this.categories = categories; 
    }

    /** Construit la section puis la retourne */
    constructorDOM() {
        const section = document.createElement("section");
        section.className = this.className;

        // Header
        if (this.categories && this.categories.length > 0) {
            const header = document.createElement("div");
            header.className = "header-category";

            const h2 = document.createElement("h2");
            h2.textContent = this.title;

            const select = document.createElement("select");
            const defaultOption = document.createElement("option");
            defaultOption.textContent = "Catégories"
            defaultOption.disabled = true;
            defaultOption.selected = true;
            select.appendChild(defaultOption);

            // option non optimiser car non dynamique
            // mappage anglais/français

            const categoryMap = {
                "Action": "Action",
                "Adult": "Adulte",
                "Adventure": "Aventure",
                "Animation": "Animation",
                "Biography": "Biographie",
                "Comedy": "Comédie",
                "Crime": "Policier",
                "Documentary": "Documentaire",
                "Drama": "Drame",
                "Family": "Famille",
                "Fantasy": "Fantastique",
                "Film-Noir": "Film noir",
                "History": "Histoire",
                "Horror": "Horreur",
                "Music": "Musique",
                "Musical": "Comédie musicale",
                "Mystery": "Mystère",
                "News": "Actualités",
                "Reality-TV": "Télé-réalité",
                "Romance": "Romance",
                "Sci-Fi": "Science-fiction",
                "Sport": "Sport",
                "Thriller": "Thriller",
                "War": "Guerre",
                "Western": "Western"
            };

            this.categories.forEach(cat => {
                const option = document.createElement("option");
                option.textContent = categoryMap[cat];
                option.value = cat;
                select.appendChild(option);
            });

            header.append(h2, select);
            section.appendChild(header);
        } else {
            const h2 = document.createElement("h2");
            h2.textContent = this.title;
            section.appendChild(h2);
        }

        // Carousel 
        const carouselDOM = new Carousel(this.movies.length, this.movies).constructorDOM();
        carouselDOM.classList.add("carousel");
        section.appendChild(carouselDOM);

        // Bouton Voir plus / Voir moins
        const voirPlusBtn = document.createElement("button");
        voirPlusBtn.textContent = "Voir plus";
        voirPlusBtn.className = "voir-plus";
        let expanded = false;

        voirPlusBtn.addEventListener("click", () => {
            if (!expanded) {
                carouselDOM.style.maxHeight = "none"; // tout afficher
                voirPlusBtn.textContent = "Voir moins";
                expanded = true;
            } else {
                carouselDOM.style.maxHeight = ""; // remet la valeur CSS par défaut
                voirPlusBtn.textContent = "Voir plus";
                expanded = false;
            }
        });

        section.appendChild(voirPlusBtn);

        
        if (this.categories && this.categories.length > 0) {
            const select = section.querySelector("select");
            select.addEventListener("change", async (e) => {
                const categoryName = e.target.value;
                const url = `http://127.0.0.1:8000/api/v1/titles/?genre=${categoryName}&sort_by=-imdb_score&page_size=6`;
                const newMovies = await createMovies(url);

                carouselDOM.innerHTML = "";
                newMovies.forEach(movie => {
                    const card = new CardMovie(movie);
                    carouselDOM.appendChild(card.constructorDOM());
                });
            });
        }

        return section;
    }
}



/** Objet Carousel parametre :(nbCardMovies: 6 || Int, movies: [] || List(Class: Movie))*/
export class Carousel {
    constructor(nbCardMovies = 6, movies = []) {
        this.nbCardMovies = nbCardMovies;
        this.movies = movies;
    }
    /** Construit le carousel puis la retourne */
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

/** Objet CardMovie parametre :(movie: Class: Movie) */
export class CardMovie {
    constructor(movie) {
        this.movie = movie;
    }
    /** Construit le CardMovie puis la retourne */
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
        button.addEventListener("click", () => {
            const modal = new Modal(this.movie.url);
            modal.open();
        });

        div.appendChild(img);
        div.appendChild(overlay);
        overlay.appendChild(h3);
        overlay.appendChild(button);

        return div;
    }
}

/** Objet Movie parametre :(url: String, title: String, urlIMg: string, description: String) */
export class Movie {
    constructor(url, title, urlImg, description) {
        this.url = url;
        this.title = title;
        this.urlImg = urlImg;
        this.description = description;
    }
}
/** Objet Modal parametre :(urlMovie: String) */
export class Modal {
    constructor(urlMovie){
        this.urlMovie = urlMovie;
        this.modal = null;
        this.overlay = null;
    }
    /** Demande les information complete du film grâce à urlMovie puis retourne les données */
    async getdata() {
        const response = await fetch(this.urlMovie);
        const data = await response.json();
        return data;
    }
    /** 
     * Récupère les données du film 
     *  Construit la fenetre modal
    */
    async open() {
        const movie = await this.getdata();

        document.body.classList.add("no-scroll");

        // overlay
        this.overlay = document.createElement("div");
        this.overlay.className = "modal-overlay";
        this.overlay.addEventListener("click", () => this.close()); // fermer au clic sur le fond
        document.body.appendChild(this.overlay);

        // modal
        this.modal = document.createElement("div");
        this.modal.className = "modal-window";

        // header
        const header = document.createElement("div");
        header.className = "header-movie";

        const info = document.createElement("div");
        info.className = "info-movie";

        const title = document.createElement("h1");
        title.textContent = movie.title;

        const dateGenre = document.createElement("h2");
        dateGenre.textContent = `${movie.year || "N/A"} - ${movie.genres || "N/A"}`;

        const infoMovie = document.createElement("h2");
        let rated
        switch (movie.rated) {
            case "Not rated or unkown rating": rated = "N/A"
            case "G" : rated = "Tous public";
            case "PG" : rated = "Interdit -10 ans";
            case "PG-13" : rated = "Interdit -13 ans";
            case "NC-17" : rated = "Interdit -18 ans";
        }
        infoMovie.textContent = `${rated} - ${movie.duration || "N/A"} minutes (${movie.countries || "N/A"})`;
        const imdbScore = document.createElement("h2");
        imdbScore.textContent = `IMDB score: ${movie.imdb_score || "N/A"}/10`;

        const boxOffice = document.createElement("h2");
        boxOffice.textContent = `Recettes au box-office: ${movie.worldwide_gross_income || "N/A"}`;

        const realisateurH3 = document.createElement("h3");
        realisateurH3.textContent = "Réalisé par:";

        const realisateurP = document.createElement("p");
        realisateurP.textContent = movie.directors || "";

        info.append(title, dateGenre, infoMovie, imdbScore, boxOffice, realisateurH3, realisateurP);
        header.append(info)
        this.modal.appendChild(header)

        // image
        const img = document.createElement("img");
        img.src = movie.image_url ;
        img.alt = movie.title;
        img.addEventListener("error", () => {
            img.src = "https://placehold.co/300?text=No+Image";
        });
        this.modal.appendChild(img);

        // Description
        const descP = document.createElement("p");
        descP.textContent = movie.long_description || "Aucune description disponible.";
        this.modal.appendChild(descP);

        // Acteurs 
        const acteursH4 = document.createElement("h4");
        acteursH4.textContent = "Avec:";
        const acteursP = document.createElement("p");
        acteursP.textContent = `${movie.actors.join(", ") || "N/A"}`;
        this.modal.append(acteursH4, acteursP)
        
        // Bouton Cross
        const btnCloseCross = document.createElement("img")
        btnCloseCross.classList.add("btn-closecross");
        btnCloseCross.src = "img/closecross.svg";   
        btnCloseCross.alt = "Fermer"
        btnCloseCross.addEventListener("click", () => this.close());
        this.modal.appendChild(btnCloseCross);

        // Bouton Fermer
        const closeBtn = document.createElement("button");
        closeBtn.textContent = "Fermer";
        closeBtn.classList.add("btn-close");
        closeBtn.addEventListener("click", () => this.close());
        this.modal.appendChild(closeBtn);

        document.body.appendChild(this.modal);
    }

    /** Supprime le modal & l'overlay */
    close() {
        if (this.modal) this.modal.remove();
        if (this.overlay) this.overlay.remove();
        document.body.classList.remove("no-scroll");
    }
}
