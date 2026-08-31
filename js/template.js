function getTemplatePokemonCard(iPkm, pokeName) {
    return `
    <div class="pokemon-card ${allPkmDetails[iPkm].types[0].type.name}">
        <div class="pokemon-name"><h1>${pokeName}</h1></div>
        <img class="poke-img" src="${allPkmDetails[iPkm].sprites["front_default"]}"></img>
        <div class="type-icons"></div>
    </div>`
}

