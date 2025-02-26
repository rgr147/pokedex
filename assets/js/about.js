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

const backgroundPokemonHtml = document.getElementById("pokemon")


pokeApiDetails.getDataPokeApi(nameParam);


function createLiTypesHtml(types) {
    //Adicionando os elementos de acordo com a quantidade de tipos que o pokemon possui
    types.map((type) => {
        const liTypePokemon = document.createElement("li");
        liTypePokemon.className = "content__pokemon__details__type";
        liTypePokemon.innerText = type;
        typesHtml.appendChild(liTypePokemon);
    });
}

function inputDetailsInHtml(poke) {
    nameHtml.innerText = poke.name;
    numberHtml.innerText = `#${poke.id}`;
   
    createLiTypesHtml(poke.types);
   
    backgroundPokemonHtml.id = `pokemon ${poke.type}`;
    spriteHtml.src = poke.sprite;

    //preenchendo informações adicionais do pokemon
    //About
    heightHtml.innerText = `${poke.height} (${(poke.height*0.3048).toFixed(2)} metros)`;
    weightHtml.innerText = `${poke.weight}lbs (${(poke.weight*0.453592).toFixed(2)} (kg)`;
    abilitiesHtml.innerText = poke.abilities.join(", ");
    genderHtml.innerText = poke.gender;
    eggGroupsHtml.innerText = poke.eggGroups;
    eggCicleHtml.innerText = poke.eggCicle;
    specieHtml.innerText = poke.specie;
}


