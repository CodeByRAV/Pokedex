let allPkm = [];
let allPkmDetails = [];
let pokemon = "pokemon?limit=20&offset=0";
let noPLimit = "pokemon?limit=100000&offset=0";
let allNames = [];
let currentNames = [];
let currentDialogIndex = 0;
const baseUrl = "https://pokeapi.co/api/v2/"

async function init() {
    await loadAndShowPokemon();
    await loadPokemonNamesOnly(noPLimit);
}

async function loadAndShowPokemon() {
    showLoadingSpinner();

    try {
        await loadPokemon(pokemon);
        await renderPokemonCards();
    } catch (exceptionVar) {
        console.log("error");
    } finally {
        hideLoadingSpinner();
    }
}

function showLoadingSpinner() {
    document.getElementById('load-more-button').classList.add('d-none');
    document.getElementById('spinner').innerHTML = `
    <div class="loading-spinner">
        <div class="spinner"><img src="./assets/icon/pokeball.svg" alt="Loading..."></div>
        <p>Loading...</p>
    </div>`;
    document.body.classList.add('no-scroll');
}

function hideLoadingSpinner() {
    document.getElementById('spinner').classList.add('d-none');
    document.getElementById('load-more-button').classList.remove('d-none');
    document.body.classList.remove('no-scroll');
}

async function loadPokemon(path = "") {
    let response = await fetch(baseUrl + path)
    let responseToJson = await response.json();
    allPkm = responseToJson.results
}

async function loadPokemonNamesOnly(path = "") {
    let response = await fetch(baseUrl + path)
    let responseToJson = await response.json();
    let allPkmNoLimit = responseToJson.results
    for (let i = 0; i < allPkmNoLimit.length; i++) {
        allNames.push(allPkmNoLimit[i].name);
    }
}

function formatPokemonName(name) {
    let formattedName = name.charAt(0).toUpperCase() +
        name.slice(1);
    return formattedName;
}

async function renderPokemonCards() {
    for (let iPkm = 0; iPkm < allPkm.length; iPkm++) {
        let pokeName = formatPokemonName(allPkm[iPkm].name);
        let response = await fetch(allPkm[iPkm].url)
        let responseToJson = await response.json();
        allPkmDetails.push(responseToJson);
        document.getElementById('pokemon-container').innerHTML += await getTemplatePokemonCard(iPkm, pokeName);
    }
}

function renderNames() {
    for (let i = 0; i < currentNames.length; i++) {
        document.getElementById('pokemon-names').innerHTML += `${currentNames[i]}`
    }
}

async function filterAndShowNames(filterWord) {
    if (filterWord.length < 3) {
        getSearchGuideTemplate();
        document.getElementById('load-more-button').classList.add('d-none');
        document.getElementById('return-to-main-button').classList.remove('d-none');
        return;
    }
    allPkmDetails = [];
    currentNames = allNames.filter(name => name.includes(filterWord.toLowerCase()));
    if (currentNames.length === 0) {
        getNotFoundTemplate();
        document.getElementById('load-more-button').classList.add('d-none');
        document.getElementById('return-to-main-button').classList.remove('d-none');
        return;
    }
    replaceThenRenderCards();
}
async function loadMorePokemon() {
    showLoadingSpinner();

    try {
        let currentCount = allPkm.length;
        let response = await fetch(baseUrl + `pokemon?limit=20&offset=${currentCount}`);
        let responseToJson = await response.json();
        allPkm.push(...responseToJson.results);

        for (let iPkm = currentCount; iPkm < allPkm.length; iPkm++) {
            let pokeName = formatPokemonName(allPkm[iPkm].name);
            let response = await fetch(allPkm[iPkm].url)
            let responseToJson = await response.json();
            allPkmDetails.push(responseToJson);
            document.getElementById('pokemon-container').innerHTML += await getTemplatePokemonCard(iPkm, pokeName);
        }
    } catch (exceptionVar) {
        console.log("error");
    } finally {
        hideLoadingSpinner();
    }
}

function showPreviousPokeDialog() {
    if (currentDialogIndex <= 0) {
        currentDialogIndex = allPkmDetails.length - 1
    } else {
        currentDialogIndex--;
    }
    openPokemonDialog(currentDialogIndex);
}

function showNextPokeDialog() {
    if (currentDialogIndex === allPkmDetails.length - 1) {
        currentDialogIndex = 0;
    } else {
        currentDialogIndex++;
    }
    openPokemonDialog(currentDialogIndex);
}

async function returnToMain() {
    console.log(allPkmDetails);
    allPkmDetails = [];
    document.getElementById('pokemon-container').innerHTML = ''

    await loadPokemon(pokemon);
    await renderPokemonCards();
    document.getElementById('load-more-button').classList.remove('d-none');
    document.getElementById('return-to-main-button').classList.add('d-none');
}

async function replaceThenRenderCards() {
    document.getElementById('pokemon-container').innerHTML = '';
    for (let iPkm = 0; iPkm < currentNames.length; iPkm++) {
        let pokeName = formatPokemonName(currentNames[iPkm]);
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${currentNames[iPkm]}`)
        let responseToJson = await response.json();
        allPkmDetails.push(responseToJson);
        document.getElementById('pokemon-container').innerHTML += await getTemplatePokemonCard(iPkm, pokeName);
    }
    document.getElementById('load-more-button').classList.add('d-none');
    document.getElementById('return-to-main-button').classList.remove('d-none');
}