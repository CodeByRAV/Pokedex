async function getTemplatePokemonCard(iPkm, pokeName) {
    return `
    <button class="pokemon-card ${allPkmDetails[iPkm].types[0].type.name}" onclick="openDialog(event, ${iPkm})">
        <div class="pokemon-name"><h1>${pokeName}</h1></div>
        <img class="poke-img" src="${allPkmDetails[iPkm].sprites["front_default"]}"></img>
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

        let generation = Object.keys(responseToJson.sprites)[0];
        let style = Object.keys(responseToJson.sprites[generation])[0];
        let pokeTypeIcon = responseToJson.sprites[generation][style].name_icon;
        
   typeIcons += `
    <img src="${pokeTypeIcon}"></img>
    `}  return typeIcons; 
}

function getTemplatePokemonDialog(iPkm) {
    return `
        <div class="pokemon-dialog">
            <h1>${allPkmDetails[iPkm].name}</h1> <img src="./assets/icon/close.svg"></img>

            <div class="pokemon-dialog-tabs">
                <button>Main information</button>
                <button>Stats</button>
                <button>Evolutions</button>
            </div>

        </div>
    `;
}