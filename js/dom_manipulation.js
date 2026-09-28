const dialogRef = document.getElementById("pokemon-dialog");

function openDialog() {
    document.documentElement.style.position = 'fixed';
    dialogRef.showModal();
    dialogRef.classList.add("opened");
}

function closeDialog(event) {
    dialogRef.close();
    dialogRef.classList.remove("opened");
    event.stopPropagation();
    document.documentElement.style.position = 'inherit';
}

function stopProp(event){
    event.stopPropagation();
}


async function openPokemonDialog(indexPkm) {
    let dialogContent = await getTemplatePokemonDialog(indexPkm);
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