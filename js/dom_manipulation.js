const dialogRef = document.getElementById("pokemon-dialog");

function openDialog() {
    document.documentElement.style.position = 'fixed';
    dialogRef.showModal();
    console.log("Dialog is opening");
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


async function openPokemonDialog(iPkm) {
    console.log(allPkmDetails[iPkm]);
    let dialogContent = await getTemplatePokemonDialog(iPkm);
    document.getElementById("pokemon-dialog-content").innerHTML = dialogContent;
    openDialog();
}

dialogRef.addEventListener('click', (event) => {
    if (event.target === dialogRef) {
        dialogRef.close();
    }
});