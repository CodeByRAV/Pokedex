const dialogRef = document.getElementById("pokemon-dialog");

function openDialog() {
    document.body.classList.add('no-scroll');
    dialogRef.showModal();
    dialogRef.classList.add("opened");
}

function closeDialog(event) {
    dialogRef.close();
    dialogRef.classList.remove("opened");
    event.stopPropagation();
    document.body.classList.remove('no-scroll');
}

function stopProp(event){
    event.stopPropagation();
}


async function openPokemonDialog(indexPkm) {
    let pokeName = formatPokemonName(allPkmDetails[indexPkm].name);
    let dialogContent = await getTemplatePokemonDialog(indexPkm, pokeName);
    document.getElementById("pokemon-dialog-content").innerHTML = dialogContent;
    currentDialogIndex = indexPkm;
    openDialog();
}

dialogRef.addEventListener('click', (event) => {
    if (event.target === dialogRef) {
        closeDialog(event);
    }
});

function dialogClosed() {
    document.documentElement.style.position = 'inherit';
    dialogRef.classList.remove("opened");
}