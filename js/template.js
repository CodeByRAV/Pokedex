async function getTemplatePokemonCard(iPkm, pokeName) {
    return `
    <button class="pokemon-card ${allPkmDetails[iPkm].types[0].type.name}" onclick="openPokemonDialog(${iPkm})">
        <div class="pokemon-name"><h1>#${iPkm + 1} ${pokeName}</h1></div>
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
        let game = Object.keys(responseToJson.sprites[generation])[0];
        let pokeTypeIcon = responseToJson.sprites[generation][game].name_icon;
        
   typeIcons += `
    <img src="${pokeTypeIcon}"></img>
    `}  return typeIcons; 
}

    async function getTemplatePokemonDialog(iPkm) {
        let pokeName = formatPokemonName(allPkm[iPkm].name)
        return `
            <div class="pokemon-dialog">
                <div class="dialog-header">
                    <h1>${pokeName}</h1>
                    <button onclick="closeDialog(event)" aria-label="Close dialog">
                            <img src="./assets/icon/close.svg" alt="close button">
                    </button>
                </div>
                <div class="poke-img-dialog">
                    <img src="${allPkmDetails[iPkm].sprites["front_default"]}"></img>
                </div>
                <div class="type-icons">
                    ${await getTemplateTypeIcons(iPkm)}
                </div>
                <div class="pokemon-dialog-tabs">
                    <button onclick="getTemplateInfo(${iPkm})">Main</button>
                    <button onclick="getTemplateStats(${iPkm})">Stats</button>
                    <button onclick="getTemplateEvo(${iPkm})">Evolutions</button>
                </div>
            </div>`;
    }

async function getTemplateMainInfo(iPkm) {
    console.log(InfoWorking)

}