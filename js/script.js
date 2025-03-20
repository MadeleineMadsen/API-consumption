// Metode 4 fra foodrepo (HTML template & content.cloneNode)

const BASE_URL = 'https://api.themoviedb.org/3/movie';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
import { API_KEY, API_TOKEN } from './info.js';

// Funktion til at hente og vise film fra TMDB API
const showMovies = async (category = 'now_playing') => {
    const fragment = document.createDocumentFragment(); // Opretter et fragment for bedre DOM-manipulation

    // Henter data fra TMDB API
    await fetch(`${BASE_URL}/${category}?api_key=${API_KEY}&language=en-US`, {
        method: 'GET', headers: {
        'Authorization': `Bearer ${API_TOKEN}`, // Bruger Bearer Token til sikker API-adgang
        'Content-Type': 'application/json'
        }
    })

    .then(response => response.json())  // Konverterer API-responsen til JSON
    .then(data => {
        
        // Går igennem hver film i resultaterne
        data.results.forEach(movie => {
            const card = document.querySelector('#movie_card').content.cloneNode(true);

            // Filmens titel
            card.querySelector('h2').innerText = movie.original_title;

            // Filmens plakat
            const img = card.querySelector('img');
            img.setAttribute('src', `${IMAGE_BASE_URL}${movie.poster_path}`);
            img.setAttribute('alt', movie.original_title);

            // Filmens beskrivelse
            card.querySelector('.movie_description').innerText = movie.overview;
            card.querySelector('.original_title').innerText = movie.original_title;
            card.querySelector('.release_date').innerText = movie.release_date;

            fragment.append(card);  // Tilføjer det klonede kort til fragmentet
        });
    })

    .catch(error => console.log(error));

    // Opdaterer DOM'en: Fjerner gamle film og indsætter de nye
    const container = document.querySelector('#movies_container');
    container.innerHTML = '';   // Rydder eksisterende indhold
    container.append(fragment); // Tilføjer de nye film

    // Opdaterer den aktive kategori i navigationen
    document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`#${category}`).classList.add('active'); // Tilføjer aktiv klasse til den valgte kategori
};

// Tilføjer event listeners til navigationens knapper
document.querySelectorAll('nav button').forEach(button => {
    
    button.addEventListener('click', (event) => {
        const category = event.target.id;   // Henter kategori fra knap-ID
        showMovies(category);   // Opdaterer filmene baseret på den valgte kategori
    });
});

// Når siden er indlæst, vises film fra "Now Playing" som standard
showMovies('now_playing');


