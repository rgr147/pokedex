/** receebendo o nome do pokemon clicado na página index.html */
const url = new URLSearchParams(window.location.search);
const nameParam = url.get("name");

//selecionando os elementos do HTML
const nameHtml = document.getElementById("name");
const numberHtml = document.getElementById("number");
const typesHtml = document.getElementById("types");
const spriteHtml = document.getElementById("sprite");
const specieHtml = document.getElementById("specie");
const heightHtml = document.getElementById("height");
const weightHtml = document.getElementById("weight");
const abilitiesHtml = document.getElementById("abilities");
const genderHtml = document.getElementById("gender");
const eggGroupsHtml = document.getElementById("eggGroups");
const eggCicleHtml = document.getElementById("eggCicle");


pokeApiDetails.getNameParam(nameParam);


function inputDetailsInHtml(poke) {
    nameHtml.innerText = poke.name;
    numberHtml.innerText = poke.id;
    // typesHtml.innerText = poke.types;
    spriteHtml.src = poke.sprite;

}


