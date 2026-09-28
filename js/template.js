async function getTemplatePokemonCard(indexPkm, pokeName) {
    return `
    <button data-id="card" class="pokemon-card ${allPkmDetails[indexPkm].types[0].type.name}" onclick="openPokemonDialog(${indexPkm})">
        <div class="pokemon-name"><h1>#${indexPkm + 1} ${pokeName}</h1></div>
        <img class="poke-img" data-id="card-image"  src="${allPkmDetails[indexPkm].sprites["front_default"]}"></img>
        <div class="type-icons">
        ${await getTemplateTypeIcons(indexPkm)}</div>
    </button>`
}

async function getTemplateTypeIcons(indexPkm) {
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

function getDialogTable(indexPkm) {
    return `                
                <table class="stats-table">
                    <tr>
                        <td>Height:</td>
                        <td>${allPkmDetails[indexPkm].height / 10 + " m"}</td>
                    </tr>
                    <tr>
                        <td>Weight:</td>
                        <td>${allPkmDetails[indexPkm].weight / 10 + " kg"}</td>
                    </tr>
                    <tr>
                        <td>Base XP:</td>
                        <td>${allPkmDetails[indexPkm].base_experience}</td>
                    </tr>
                    <tr>
                        <td>Abilities:</td>
                        <td>${getAbilities(indexPkm)}</td>
                    </tr>
                </table>`;
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

async function getTemplatePokemonDialog(indexPkm) {
    let pokeName = formatPokemonName(allPkmDetails[indexPkm].name);
    return `
            <div class="pokemon-dialog">
                <div class="dialog-header">
                    <h1 data-id="overlay-pokemon-name">${pokeName}</h1>
                    <button data-id="close-dialog-button" onclick="closeDialog(event)" aria-label="Close dialog">
                            <img src="./assets/icon/close.svg" alt="close button">
                    </button>
                </div>
                <div class="poke-img-dialog">
                    <img data-id="dialog-image" src="${allPkmDetails[indexPkm].sprites["front_default"]}"></img>
                </div>
                <div class="type-icons">
                    ${await getTemplateTypeIcons(indexPkm)}
                </div>
                <div class="pokemon-dialog-tabs">
                    <button onclick="getTemplateInfo(${indexPkm})">Main</button>
                    <button onclick="getTemplateEvo(${indexPkm})">Evolutions</button>
                </div> 
                <div id="dialog-info">
                ${await getDialogTable(indexPkm)}
                </div>
                <div class="poke-dialog-counter">
                <button data-id="prev-button" onclick="showPreviousPokeDialog()" id="previous-dialog" aria-label="Previous image"><img src="./assets/icon/button_left.svg" alt="Arrow left"></button>
                <h3 id="image-counter"
                    aria-label="Pokemon-Card Counter">
                    ${indexPkm + 1}/${allPkmDetails.length}
                    </h3>
                <button data-id="next-button" onclick="showNextPokeDialog()" id="next-dialog" aria-label="Next dialog"><img src="./assets/icon/button_right.svg" alt="Arrow right"></button>
                </div>
            </div>`;
}

function getTemplateInfo(indexPkm) {
    document.getElementById('dialog-info').innerHTML = getDialogTable(indexPkm);
}

async function getTemplateEvo(indexPkm) {
    let secondEvo = await loadEvolvedPokemon(indexPkm);
    let firstEvo = await loadEvolvedFrom(indexPkm);
    let finalEvo = await loadFinalEvolution(indexPkm);
    document.getElementById('dialog-info').innerHTML = `
    <div class="evolution-chain">
        <div class="evolution-chain-cards">
        <img src="${firstEvo}"></img>
        <img src="${secondEvo}"></img>
        <img src="${finalEvo}"></img>
        </div>
    </div>`;
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

function getNotFoundTemplate() {
    document.getElementById('pokemon-container').innerHTML = `
        <div class="not-found">
            <h1>ERROR 404: No Pokemon were found. Please check the spelling and try again!</h1>
        </div>`;
}

function getSearchGuideTemplate() {
    document.getElementById('pokemon-container').innerHTML = `
        <div class="not-found">
            <h1>Please type at least 3 characters and try again!</h1>
        </div>`;
}

function getErrorTemplate() {
        document.getElementById('pokemon-container').innerHTML = `
        <div class="failed-to-load">
            <h1>ERROR: 404</h1>
            <p>Pokemon couldnt be loaded, try again later!</p>
        </div>`;
}