let allPkm = [];
let allPkmDetails =[];
let pokemon = "pokemon?limit=20&offset=0";

async function init() {
console.log("Init is Running")
await loadPokemon(pokemon);
await renderPokemonCards();
}

const baseUrl = "https://pokeapi.co/api/v2/"

async function loadPokemon(path="") {
    let response = await fetch(baseUrl + path)
    let responseToJson = await response.json();
    console.table(responseToJson.results);
    allPkm = responseToJson.results
    console.log(allPkm)
} 

async function renderPokemonCards() {
    console.log("RENDERING", allPkm.length);
    for (let iPkm = 0; iPkm < allPkm.length; iPkm++) {
        let response = await fetch(allPkm[iPkm].url)
        let responseToJson = await response.json();
        console.log(responseToJson)
        allPkmDetails.push(responseToJson);
        document.getElementById('pokemon-container').innerHTML += getTemplatePokemonCard(iPkm);
        
    }
    console.log(allPkmDetails);
}