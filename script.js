let allPkm = [];
let pokemon = "pokemon?limit=20&offset=0";

function init() {
loadPokemon(pokemon)    
}

const baseUrl = "https://pokeapi.co/api/v2/"

async function loadPokemon(path="") {
    let response = await fetch(baseUrl +path)
    let responseToJson = await response.json();
    console.table(responseToJson.results);
    allPkm.push(responseToJson.results);
} 

function renderPokemonCards() {
    for (let index = 0; index < allPkm.length; index++) {
        document.getElementById('pokemon-container').innerHTML += getTemplatePokemonCard();
        
        renderPokemonCards();
    }
}