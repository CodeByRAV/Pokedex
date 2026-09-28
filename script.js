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
        await fetchPokemonCardDetails();
        replaceReturnWithLoadButton();
    } catch (exceptionVar) {
        console.log("error");
        document.getElementById('pokemon-container').innerHTML = getErrorTemplate();
        replaceLoadWithReturnButton();
    } finally {
        hideLoadingSpinner();
    }
    
}

function showLoadingSpinner() {
    document.getElementById('spinner').classList.remove('d-none');
    console.log(document.getElementById('spinner'));
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

async function fetchPokemonCardDetails() {
    for (let indexPkm = 0; indexPkm < allPkm.length; indexPkm++) {
        if (!allPkmDetails[indexPkm]) {
            let response = await fetch(allPkm[indexPkm].url)
            let responseToJson = await response.json();
            allPkmDetails.push(responseToJson);
        }
    }
    await renderPokemonCards();
}

async function renderPokemonCards() {
    let allCards = '';
    for (let indexPkm = 0; indexPkm < allPkm.length; indexPkm++) {
        let pokeName = formatPokemonName(allPkm[indexPkm].name);
        allCards += await getTemplatePokemonCard(indexPkm, pokeName);
    }
    document.getElementById('pokemon-container').innerHTML = allCards;
}

function replaceLoadWithReturnButton() {
    document.getElementById('load-more-button').classList.add('d-none');
    document.getElementById('return-to-main-button').classList.remove('d-none');
}

function replaceReturnWithLoadButton() {
    document.getElementById('load-more-button').classList.remove('d-none');
    document.getElementById('return-to-main-button').classList.add('d-none');
}

async function filterAndShowNames(filterWord) {
    showLoadingSpinner();
    try {
        if (filterWord.length < 3) {
            document.getElementById('pokemon-container').innerHTML = getSearchGuideTemplate();
            replaceLoadWithReturnButton();
            return;
        }
        allPkmDetails = [];
        currentNames = allNames.filter(name => name.includes(filterWord.toLowerCase()));
        if (currentNames.length === 0) {
            document.getElementById('pokemon-container').innerHTML = getNotFoundTemplate();
            replaceLoadWithReturnButton();
            return;
        }
        await replaceThenRenderCards();
    } catch (exceptionVar) {
        console.log("error");
        getErrorTemplate();
        replaceLoadWithReturnButton();
    } finally {
        hideLoadingSpinner();
    }
}
async function loadMorePokemon() {
    showLoadingSpinner();
    try {
        let currentCount = allPkm.length;
        let response = await fetch(baseUrl + `pokemon?limit=20&offset=${currentCount}`);
        let responseToJson = await response.json();
        allPkm.push(...responseToJson.results);

        for (let indexPkm = currentCount; indexPkm < allPkm.length; indexPkm++) {
            let pokeName = formatPokemonName(allPkm[indexPkm].name);
            let response = await fetch(allPkm[indexPkm].url)
            let responseToJson = await response.json();
            allPkmDetails.push(responseToJson);
            document.getElementById('pokemon-container').innerHTML += await getTemplatePokemonCard(indexPkm, pokeName);
        }
    } catch (exceptionVar) {
        console.log("error");
    } finally {
        hideLoadingSpinner();
    }
    document.getElementById('load-more-button').classList.remove('d-none');
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
    await fetchPokemonCardDetails();
    document.getElementById('load-more-button').classList.remove('d-none');
    document.getElementById('return-to-main-button').classList.add('d-none');
}

async function replaceThenRenderCards() {

    document.getElementById('pokemon-container').innerHTML = '';
    for (let indexPkm = 0; indexPkm < currentNames.length; indexPkm++) {
        let pokeName = formatPokemonName(currentNames[indexPkm]);
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${currentNames[indexPkm]}`)
        let responseToJson = await response.json();
        allPkmDetails.push(responseToJson);
        document.getElementById('pokemon-container').innerHTML += await getTemplatePokemonCard(indexPkm, pokeName);
    }
    replaceLoadWithReturnButton();
}

async function getTypeIcons(indexPkm) {
    let typeIcons = "";
    for (let iType = 0; iType < allPkmDetails[indexPkm].types.length; iType++) {
        let pokeTypeIconURL = allPkmDetails[indexPkm].types[iType].type.url
        let response = await fetch(pokeTypeIconURL);
        let responseToJson = await response.json();
        let generations = Object.keys(responseToJson.sprites);
        let generation = "";
        let pokeTypeIcon = "";
        for (let i in generations) {
            let game = Object.keys(responseToJson.sprites[generations[i]])[0];
            if (responseToJson.sprites[generations[i]][game].name_icon !== null) {
                generation = Object.keys(responseToJson.sprites)[i];
                pokeTypeIcon = responseToJson.sprites[generation][game].name_icon;
                break;
            }
        }
        typeIcons += `
    <img src="${pokeTypeIcon}"></img>
    `}
    return typeIcons;
}

function getAbilities(indexPkm) {

    let abilities = "";

    for (let iAbility = 0; iAbility < allPkmDetails[indexPkm].abilities.length; iAbility++) {
        let ability = allPkmDetails[indexPkm].abilities[iAbility].ability.name;
        abilities += ability;

        if (iAbility < allPkmDetails[indexPkm].abilities.length - 1) {
            abilities += ", ";
        }
    }
    return abilities;
}

async function loadEvolvedPokemon(indexPkm) {
    let evoChainURL = allPkmDetails[indexPkm].species.url;
    let response = await fetch(evoChainURL);
    let responseToJson = await response.json();
    let evoChainInfo = responseToJson.evolution_chain.url;
    let evoResponse = await fetch(evoChainInfo);
    let evoResponseToJson = await evoResponse.json();
    let evoChain = evoResponseToJson.chain;
    let evolvedTo = evoChain.evolves_to[0].species.name;
    let evolvedToResponse = await fetch(baseUrl + "pokemon/" + evolvedTo);
    let evolvedToResponseToJson = await evolvedToResponse.json();
    let evolvedToSprite = evolvedToResponseToJson.sprites["front_default"];
    return evolvedToSprite;
}

async function loadEvolvedFrom(indexPkm) {
    let evoChainURL = allPkmDetails[indexPkm].species.url;
    let response = await fetch(evoChainURL);
    let responseToJson = await response.json();
    let evoChainInfo = responseToJson.evolution_chain.url;
    let evoResponse = await fetch(evoChainInfo);
    let evoResponseToJson = await evoResponse.json();
    let evoChain = evoResponseToJson.chain;
    let evofirstform = evoChain.species.name;
    let evofirstformResponse = await fetch(baseUrl + "pokemon/" + evofirstform);
    let evofirstformResponseToJson = await evofirstformResponse.json();
    let evofirstformSprite = evofirstformResponseToJson.sprites["front_default"];
    return evofirstformSprite;
}

async function loadFinalEvolution(indexPkm) {
    let evoChainURL = allPkmDetails[indexPkm].species.url;
    let response = await fetch(evoChainURL);
    let responseToJson = await response.json();
    let evoChainInfo = responseToJson.evolution_chain.url;
    let evoResponse = await fetch(evoChainInfo);
    let evoResponseToJson = await evoResponse.json();
    let evoChain = evoResponseToJson.chain;
    let finalEvo = evoChain.evolves_to[0].evolves_to[0].species.name;
    let finalEvoResponse = await fetch(baseUrl + "pokemon/" + finalEvo);
    let finalEvoResponseToJson = await finalEvoResponse.json();
    let finalEvoSprite = finalEvoResponseToJson.sprites["front_default"];
    return finalEvoSprite;
}

function getTemplateInfo(indexPkm) {
    document.getElementById('dialog-info').innerHTML = getDialogTable(indexPkm);
}