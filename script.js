let allPkm = [];
let pokemon = "pokemon?limit=20&offset=0";

async function init() {
console.log("Init is Running")
await loadPokemon(pokemon);
renderPokemonCards();
}

const baseUrl = "https://pokeapi.co/api/v2/"

async function loadPokemon(path="") {
    let response = await fetch(baseUrl +path)
    let responseToJson = await response.json();
    console.table(responseToJson.results);
    allPkm = responseToJson.results
    console.log(allPkm)
} 

function renderPokemonCards() {
    console.log("RENDERING", allPkm.length);
    for (let iPkm = 0; iPkm < allPkm.length; iPkm++) {
        document.getElementById('pokemon-container').innerHTML += getTemplatePokemonCard(iPkm);
    }
}