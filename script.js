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
} 

function renderPokemonCards() {
    for (let iPkm = 0; iPkm < allPkm.length; iPkm++) {
        document.getElementById('pokemon-container').innerHTML += getTemplatePokemonCard(iPkm);
        
        renderPokemonCards();
    }
}