//recebendo o nome do pokemon como parâmetro
const url = new URLSearchParams(window.location.search);
const nameParam = url.get("name");


//selecionando os campos que receberão as informações básicas do pokemon no HTML
const nameHtml = document.getElementById("name");
const numberHtml = document.getElementById("number");
const typesHtml = document.getElementById("types");
const spriteHtml = document.getElementById("sprite");
const backgroundPokemonHtml = document.getElementById("pokemon");


//selecionando os campos que receberão as informações detalhadas da página About no HTML
const specieHtml = document.getElementById("specie");
const heightHtml = document.getElementById("height");
const weightHtml = document.getElementById("weight");
const abilitiesHtml = document.getElementById("abilities");
const genderHtml = document.getElementById("gender");
const eggGroupsHtml = document.getElementById("eggGroups");
const eggCicleHtml = document.getElementById("eggCicle");


//selecionando todas as tags ancoras do menu de navegação
const linkAbout = document.getElementById("link-about"); 
const linkBaseStats = document.getElementById("link-base-stats");
const allLinks = document.querySelectorAll(".content__description-pokemon__stats__nav a");


//selecionando todas as divs que contem informações sobre o pokemon
const baseStatsDiv = document.getElementById("base-stats");
const aboutDiv = document.getElementById("about");
const allDivsContent = document.querySelectorAll(".content-div");


//ouvindo cliques nos botões do menu de navegação para chamar as informações correspondentes. 
linkBaseStats.addEventListener("click", () => {
    selectBaseStats();
});

linkAbout.addEventListener("click", () => {
    selectAbout();
})


//funções correspondentes ao links do menu de navegação. Puxam os dados e dão efeitos visuais nos links selecionados
function selectAbout() {
    allLinks.forEach(function(link) {
        link.classList.remove("link-active");
        link.classList.add("link-inactive");
    })
    
    linkAbout.classList.remove("link-inactive");
    linkAbout.classList.add("link-active");

    allDivsContent.forEach(function(div) {
        div.classList.add("hidden");
    })

    aboutDiv.classList.remove("hidden");
}

function selectBaseStats() {
    allLinks.forEach(function(link) {
        link.classList.remove("link-active");
        link.classList.add("link-inactive");
    })
    linkBaseStats.classList.remove("link-inactive");
    linkBaseStats.classList.add("link-active");

    allDivsContent.forEach(function(div) {
        div.classList.add("hidden");
    })
    
    baseStatsDiv.classList.remove("hidden");    
}


//chamando a função responsável por conectar à API PokeAPi para puxar as informações do pokemon tendo o nome como parâmetro
pokeApiDetails.getDataPokeApi(nameParam);


//preenchendo as informações básicas e informações do About sobre o pokemon
function inputDetailsInHtml(poke) {
    nameHtml.innerText = poke.name;
    numberHtml.innerText = `#${poke.id}`;
    createLiTypesHtml(poke.types);
    backgroundPokemonHtml.id = `pokemon ${poke.type}`;
    spriteHtml.src = poke.sprite;  
    
    inputAboutDataInHtml(poke);
    inputBaseStatsDataInHtml(poke);
}

//preenchendo as informações detalhadas da aba About
function inputAboutDataInHtml(poke) {
    heightHtml.innerText = `${poke.height} (${(poke.height*0.3048).toFixed(2)} metros)`;
    weightHtml.innerText = `${poke.weight}lbs (${(poke.weight*0.453592).toFixed(2)} (kg)`;
    abilitiesHtml.innerText = poke.abilities.join(", ");
    genderHtml.innerText = poke.gender;
    eggGroupsHtml.innerText = poke.eggGroups;
    eggCicleHtml.innerText = poke.eggCicle;
    specieHtml.innerText = poke.specie;
}

//preenchendo as informações detalhadas da aba Base Stats
function inputBaseStatsDataInHtml(poke) {
    console.log(poke);
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

