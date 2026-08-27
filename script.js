let pokemon = "pokemon"


function init() {
loadPokemon(pokemon)    
}

const baseUrl = "https://pokeapi.co/api/v2/"

async function loadPokemon(path="") {
    let response = await fetch(baseUrl +path)
    let responseToJson = await response.json();
    console.table(responseToJson.results);
} 

