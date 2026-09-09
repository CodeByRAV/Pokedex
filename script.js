let allPkm = [];
let allPkmDetails =[];
let pokemon = "pokemon?limit=20&offset=0";
let noPLimit = "pokemon?limit=100000&offset=0";
let allNames = [];
let currentNames = [];

async function init() {
console.log("Init is Running")
await loadPokemon(pokemon);
await loadPokemonNamesOnly(noPLimit);
await renderPokemonCards();
}

const baseUrl = "https://pokeapi.co/api/v2/"

async function loadPokemon(path="") {
    let response = await fetch(baseUrl + path)
    let responseToJson = await response.json();
    console.table(responseToJson.results);
    allPkm = responseToJson.results
    console.log(allPkm);

} 

async function loadPokemonNamesOnly(path="") {
    let response = await fetch(baseUrl + path)
    let responseToJson = await response.json();
    let allPkmNoLimit = responseToJson.results
    for (let i = 0; i <allPkmNoLimit.length; i++) {
        allNames.push(allPkmNoLimit[i].name);
    }
    console.log(allNames);
}

function formatPokemonName(name) {
    let formattedName = name.charAt(0).toUpperCase() +
    name.slice(1);
    return formattedName;
}

async function renderPokemonCards() {
    console.log("RENDERING", allPkm.length);
    for (let iPkm = 0; iPkm < allPkm.length; iPkm++) {
        let pokeName = formatPokemonName(allPkm[iPkm].name);
        let response = await fetch(allPkm[iPkm].url)
        let responseToJson = await response.json();
        allPkmDetails.push(responseToJson);
        document.getElementById('pokemon-container').innerHTML += await getTemplatePokemonCard(iPkm, pokeName);
    }
    console.log(allPkmDetails);
}

function renderNames() {
for (let i = 0; i < currentNames.length; i++) {
document.getElementById('pokemon-names').innerHTML += `${currentNames[i]}`
}
}

async function filterAndShowNames(filterWord) {
    allPkmDetails = [];
    currentNames = allNames.filter(name => name.includes(filterWord.toLowerCase()));
    document.getElementById('pokemon-container').innerHTML = '';
    for (let iPkm = 0; iPkm < currentNames.length; iPkm++) {
        let pokeName = formatPokemonName(currentNames[iPkm]);
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${currentNames[iPkm]}`)
        let responseToJson = await response.json();
        allPkmDetails.push(responseToJson);
        document.getElementById('pokemon-container').innerHTML += await getTemplatePokemonCard(iPkm, pokeName);
    }
}
