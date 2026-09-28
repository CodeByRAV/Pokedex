async function getTemplatePokemonCard(indexPkm, pokeName) {
    return `
    <button data-id="card" class="pokemon-card ${allPkmDetails[indexPkm].types[0].type.name}" onclick="openPokemonDialog(${indexPkm})">
        <div class="pokemon-name"><h1>#${indexPkm + 1} ${pokeName}</h1></div>
        <img class="poke-img" data-id="card-image"  src="${allPkmDetails[indexPkm].sprites["front_default"]}"></img>
        <div class="type-icons">
        ${await getTypeIcons(indexPkm)}</div>
    </button>`
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

async function getTemplatePokemonDialog(indexPkm, pokeName) {
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
                    ${await getTypeIcons(indexPkm)}
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

function getNotFoundTemplate() {
    return `
        <div class="not-found">
            <h1>ERROR 404: No Pokemon were found. Please check the spelling and try again!</h1>
        </div>`;
}

function getSearchGuideTemplate() {
    return `
        <div class="not-found">
            <h1>Please type at least 3 characters and try again!</h1>
        </div>`;
}

function getErrorTemplate() {
    return `
        <div class="failed-to-load">
            <h1>ERROR: 404</h1>
            <p>Pokemon couldnt be loaded, try again later!</p>
        </div>`;
}