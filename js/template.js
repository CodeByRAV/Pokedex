function getTemplatePokemonCard(iPkm) {
    return `
    <div class="pokemon-card ${allPkmDetails[iPkm].types[0].type.name}">
        <h1>${allPkm[iPkm].name}</h1>
        <img class="poke-img" src="${allPkmDetails[iPkm].sprites["front_default"]}"></img>
        <img></img>
    </div>`
}