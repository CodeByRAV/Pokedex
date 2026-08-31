function getTemplatePokemonCard(iPkm) {
    return `<div class="pokemon-card">
        <h1>${allPkm[iPkm].name}</h1>
        <img class="poke-img" src="${allPkmDetails[iPkm].sprites["front_default"]}"></img>
            </div>`
}