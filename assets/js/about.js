/** receebendo o nome do pokemon clicado na página index.html */
const url = new URLSearchParams(window.location.search);
const nameParam = url.get("name");

//selecionando os elementos básicos referente ao pokemon no HTML
const nameHtml = document.getElementById("name");
const numberHtml = document.getElementById("number");
const typesHtml = document.getElementById("types");
const spriteHtml = document.getElementById("sprite");
const backgroundPokemonHtml = document.getElementById("pokemon");
//selecionando os elementos referente aos detalhes do About no HTML
const specieHtml = document.getElementById("specie");
const heightHtml = document.getElementById("height");
const weightHtml = document.getElementById("weight");
const abilitiesHtml = document.getElementById("abilities");
const genderHtml = document.getElementById("gender");
const eggGroupsHtml = document.getElementById("eggGroups");
const eggCicleHtml = document.getElementById("eggCicle");
//selecionando as divs de cada aba do menu de navegação
const linkAbout = document.getElementById("link-about");
const linkBaseStats = document.getElementById("link-base-stats");
const baseStatsDiv = document.getElementById("base-stats");
const aboutDiv = document.getElementById("about");
const links = document.querySelectorAll("content__description-pokemon__stats__nav a");

pokeApiDetails.getDataPokeApi(nameParam);

//função para abrir a div about
function showAbout() {
    removeActiveClass();
    links.classList.add("deactivate");

}    
removeActiveClass();
//função para abrir a div base stats
function showBaseStats() {
    removeActiveClass();
    baseStatsDiv.classList.remove("hidden");
    about.classList.add("hidden");
    linkBaseStats.classList.add("active");
}
//função para remover a class active das divs do menu de navegação
function removeActiveClass() {
    links.forEach(link => {
        link.classList.remove("active");
        link.classList.add("deactivate");
    });
}
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
//reconhecendo o click na opção "about" do menu  de navegação 
linkAbout.addEventListener("click", (event) => {
    showAbout();
})
//reconhecendo o click na opção "base-stats" do menu  de navegação 
linkBaseStats.addEventListener("click", (event) => {
    console.log("clicou em base stats");
    showBaseStats();
})

