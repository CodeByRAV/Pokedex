const dialogRef = document.getElementById("pokemon-dialog");

function openDialog() {
    dialogRef.showModal();
    console.log("Dialog is opening");
    dialogRef.classList.add("opened");
}

function closeDialog(event) {
    dialogRef.close();
    dialogRef.classList.remove("opened");
    event.stopPropagation();
}

function stopProp(event){
    event.stopPropagation();
}


function openPokemonDialog(iPkm) {
    console.log(allPkmDetails[iPkm]);
    let dialogContent = getTemplatePokemonDialog(iPkm);
    document.getElementById("pokemon-dialog-content").innerHTML = dialogContent;
    openDialog();
}