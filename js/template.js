async function getTemplatePokemonCard(iPkm, pokeName) {
    return `
    <button data-id="card" class="pokemon-card ${allPkmDetails[iPkm].types[0].type.name}" onclick="openPokemonDialog(${iPkm})">
        <div class="pokemon-name"><h1>#${iPkm + 1} ${pokeName}</h1></div>
        <img class="poke-img" data-id="card-image"  src="${allPkmDetails[iPkm].sprites["front_default"]}"></img>
        <div class="type-icons">
        ${await getTemplateTypeIcons(iPkm)}</div>
    </button>`
}

async function getTemplateTypeIcons(iPkm) {
    let typeIcons = "";

    for (let iType = 0; iType < allPkmDetails[iPkm].types.length; iType++) {
        let pokeTypeIconURL = allPkmDetails[iPkm].types[iType].type.url
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

function getDialogTable(iPkm) {
    return `                
                <table class="stats-table">
                    <tr>
                        <td>Height:</td>
                        <td>${allPkmDetails[iPkm].height / 10 + " m"}</td>
                    </tr>
                    <tr>
                        <td>Weight:</td>
                        <td>${allPkmDetails[iPkm].weight / 10 + " kg"}</td>
                    </tr>
                    <tr>
                        <td>Base XP:</td>
                        <td>${allPkmDetails[iPkm].base_experience}</td>
                    </tr>
                    <tr>
                        <td>Abilities:</td>
                        <td>${getAbilities(iPkm)}</td>
                    </tr>
                </table>`;
}

function getAbilities(iPkm) {

    let abilities = "";

    for (let iAbility = 0; iAbility < allPkmDetails[iPkm].abilities.length; iAbility++) {
        let ability = allPkmDetails[iPkm].abilities[iAbility].ability.name;
        abilities += ability;

        if (iAbility < allPkmDetails[iPkm].abilities.length - 1) {
            abilities += ", ";
        }
    }

    return abilities;
}

async function getTemplatePokemonDialog(iPkm) {
    let pokeName = formatPokemonName(allPkmDetails[iPkm].name); console.log(allPkm[iPkm].name);
    return `
            <div class="pokemon-dialog">
                <div class="dialog-header">
                    <h1 data-id="overlay-pokemon-name">${pokeName}</h1>
                    <button data-id="close-dialog-button" onclick="closeDialog(event)" aria-label="Close dialog">
                            <img src="./assets/icon/close.svg" alt="close button">
                    </button>
                </div>
                <div class="poke-img-dialog">
                    <img data-id="dialog-image" src="${allPkmDetails[iPkm].sprites["front_default"]}"></img>
                </div>
                <div class="type-icons">
                    ${await getTemplateTypeIcons(iPkm)}
                </div>
                <div class="pokemon-dialog-tabs">
                    <button onclick="getTemplateInfo(${iPkm})">Main</button>
                    <button onclick="getTemplateEvo(${iPkm})">Evolutions</button>
                </div> 
                <div id="dialog-info">
                ${await getDialogTable(iPkm)}
                </div>
                <div class="poke-dialog-counter">
                <button data-id="prev-button" onclick="showPreviousPokeDialog()" id="previous-dialog" aria-label="Previous image"><img src="./assets/icon/button_left.svg" alt="Arrow left"></button>
                <h3 id="image-counter"
                    aria-label="Pokemon-Card Counter">
                    ${iPkm + 1}/${allPkmDetails.length}
                    </h3>
                <button data-id="next-button" onclick="showNextPokeDialog()" id="next-dialog" aria-label="Next dialog"><img src="./assets/icon/button_right.svg" alt="Arrow right"></button>
                </div>
            </div>`;
}

function getTemplateInfo(iPkm) {
    console.log('InfoWorking');
    document.getElementById('dialog-info').innerHTML = getDialogTable(iPkm);
}

async function getTemplateEvo(iPkm) {
    console.log('EvoWorking');
    let secondEvo = await loadEvolvedPokemon(iPkm);
    let firstEvo = await loadEvolvedFrom(iPkm);
    let finalEvo = await loadFinalEvolution(iPkm);
    console.log('EvolvedPokemon', secondEvo);
    document.getElementById('dialog-info').innerHTML = `
    <div class="evolution-chain">
        <div class="evolution-chain-cards">
        <img src="${firstEvo}"></img>
        <img src="${secondEvo}"></img>
        <img src="${finalEvo}"></img>
        </div>
    </div>`;
}

async function loadEvolvedPokemon(iPkm) {
    let evoChainURL = allPkmDetails[iPkm].species.url;
    let response = await fetch(evoChainURL);
    let responseToJson = await response.json();
    let evoChainInfo = responseToJson.evolution_chain.url;
    let evoResponse = await fetch(evoChainInfo);
    let evoResponseToJson = await evoResponse.json();
    let evoChain = evoResponseToJson.chain;
    console.log(evoChain);
    let evolvedTo = evoChain.evolves_to[0].species.name;
    let evolvedToResponse = await fetch(baseUrl + "pokemon/" + evolvedTo);
    let evolvedToResponseToJson = await evolvedToResponse.json();
    let evolvedToSprite = evolvedToResponseToJson.sprites["front_default"];
    console.log(evolvedToSprite);
    return evolvedToSprite;
}

async function loadEvolvedFrom(iPkm) {
    let evoChainURL = allPkmDetails[iPkm].species.url;
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
    console.log(evofirstformSprite);
    return evofirstformSprite;
}

async function loadFinalEvolution(iPkm) {
    let evoChainURL = allPkmDetails[iPkm].species.url;
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
    console.log(finalEvoSprite);
    return finalEvoSprite;
}
