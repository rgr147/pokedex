//recebendo, da página index.html, o nome do pokemon através do parâmetro na url
const url = new URLSearchParams(window.location.search);
const nameParam = url.get("name");

//selecionando o botão de retornar do Header, para à página principal
const buttonBack = document.getElementById("button-back");

//selecionando os elementos da pagina-about para adicionar informações do pokemon
const nameHtml = document.getElementById("name");
const numberHtml = document.getElementById("number");
const typesHtml = document.getElementById("types");
const spriteHtml = document.getElementById("sprite");
const backgroundPokemonHtml = document.getElementById("content");
const backgroundHeaderHtml = document.getElementById("header-menu");
const backgroundFooterHtml = document.getElementById("footer");

//seleccionando os elementos da div about para adicionar informações do pokemon
const specieHtml = document.getElementById("specie");
const heightHtml = document.getElementById("height");
const weightHtml = document.getElementById("weight");
const abilitiesHtml = document.getElementById("abilities");
const genderHtml = document.getElementById("gender");
const eggGroupsHtml = document.getElementById("eggGroups");
const eggCicleHtml = document.getElementById("eggCicle");

//selecionando os elementos da div base stats para adicionar informações do pokemon
const baseStatsHp = document.getElementById("base-stats-hp");
const baseStatsAttack = document.getElementById("base-stats-attack");
const baseStatsDefense = document.getElementById("base-stats-defense");
const baseStatsSpAttack = document.getElementById("base-stats-sp-attack");
const baseStatsSpDefense = document.getElementById("base-stats-sp-defense");
const baseStatsSpeed = document.getElementById("base-stats-speed");
const baseStatsTotal = document.getElementById("base-stats-total");
const baseStatsDefenses = document.querySelector(".content__description-pokemon__base-stats__observation");

//selecionando os elementos da div evolution para adicionar a sequencia de evolução do pokemon
const evolutionContainer = document.getElementById("evolution-container");
const evolution01Image = document.getElementById("evolution-01");
const evolution02Image = document.getElementById("evolution-02");
const evolution03Image = document.getElementById("evolution-03");
const evolution04Image = document.getElementById("evolution-04");
const evolution01Name = document.getElementById("evolution-01-name");
const evolution01Level = document.getElementById("evolution-01-level");
const evolution02Name = document.getElementById("evolution-02-name");
const evolution03Name = document.getElementById("evolution-03-name");
const evolution03Level = document.getElementById("evolution-03-level");
const evolution04Name = document.getElementById("evolution-04-name");

//selecionando todos elementos das tags ancoras do menu de navegação sobre o pokemon
const linkAbout = document.getElementById("link-about"); 
const linkBaseStats = document.getElementById("link-base-stats");
const linkEvolution = document.getElementById("link-evolution");
const allLinks = document.querySelectorAll(".content__description-pokemon__nav a");

//selecionando todas divs relacionadas ao menu de navegação sobre o pokemon
const baseStatsDiv = document.getElementById("base-stats");
const aboutDiv = document.getElementById("about");
const evolutionDiv = document.getElementById("evolution");
const allDivsContent = document.querySelectorAll(".content-div");


//ouvindo cliques nos botões do menu de navegação sobre o pokemon. 
linkEvolution.addEventListener("click", () => {
    selectEvolution();
    
});
linkBaseStats.addEventListener("click", () => {
    selectBaseStats();
});

linkAbout.addEventListener("click", () => {
    selectAbout();
});

//ouvindo o botão de retornar para a página principal
buttonBack.addEventListener("click", () => {
    window.location.href = "./index.html";
})
//funcção responsavel por mostrar a div Evolution do pokemon e ocultar as demais divs
function selectEvolution() {
    allLinks.forEach(function(link) {
        link.classList.remove("link-active");
        link.classList.add("link-inactive");
    })

    linkEvolution.classList.remove("link-inactive");
    linkEvolution.classList.add("link-active");

    allDivsContent.forEach(function(div) {
        div.classList.add("hidden");
    })
    evolutionDiv.classList.remove("hidden");
}
//função correspondente ao ao link About do menu de navegação. Puxa os dados do pokemon e dá efeito de botão ativado
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
//função correspondenteao ao link Base Stats do menu de navegação. Puxa os dados do pokemon e dá efeito de botão ativado
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

//preenchendo as informações básicas da pagina-about e informações do About sobre o pokemon
function inputDetailsInHtml(poke) {
    //inserindo dados básicos da página
    nameHtml.innerText = poke.name;
    formatIdPokemon(poke.id);
    createLiTypesHtml(poke.types);
    backgroundPokemonHtml.classList.add(poke.type);
    backgroundHeaderHtml.classList.add(poke.type);
    backgroundFooterHtml.classList.add(poke.type);
    spriteHtml.src = poke.sprite;  
    
    inputAboutDataInHtml(poke);//inserindo os dados da div about
    inputBaseStatsDataInHtml(poke);//inserindo os dados da div base stats
    // inputEvolutionDataInHtml(poke);//inserindo os dados da div base stats
    
}
//função responsável por formatar o ID do pokemon e manter 3 dígitos
function formatIdPokemon(id){
    const idString = id.toString();
    if(idString.length < 2){
        numberHtml.innerText = `#00${idString}`;
    } else if(idString.length < 3) {
        numberHtml.innerText = `#0${idString}`;
    } else {
        numberHtml.innerText = `#${idString}`;
    }
}
//função responsável por inserir LIs no HTML com os tipos do pokemon 
function createLiTypesHtml(types) {
    //Adicionando os elementos de acordo com a quantidade de tipos que o pokemon possui
    types.map((type) => {
        const liTypePokemon = document.createElement("li");
        liTypePokemon.className = `content__pokemon__details__type ${type}`;
        liTypePokemon.innerText = type;
        typesHtml.appendChild(liTypePokemon);
    });
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
    baseStatsHp.innerText = poke.stats.hp;
    baseStatsAttack.innerText = poke.stats.attack;
    baseStatsDefense.innerText = poke.stats.defense;
    baseStatsSpAttack.innerText = poke.stats["special-attack"];
    baseStatsSpDefense.innerText = poke.stats["special-defense"];
    baseStatsSpeed.innerText = poke.stats.speed;
    baseStatsTotal.innerText = poke.stats.total;
    baseStatsDefenses.innerHTML += poke.defenses;
    addAnimationBars(poke);//animação com efeito de carregamento das barras de estatisticas
}

//preenchendo as informações da div evolution. função adiciona trecho HTML da div com as 3 evoluções do pokemon 
function insertHtmlWithTreeEvolution(listEvolutions) {
    const htmlForAppendInEvolutionContainer = `
        <div class="content__description-pokemon__evolution__container__item">
            <img src="${listEvolutions[0].url_sprite}" id="evolution-01" class="evolution-img"/>
            <span id="evolution-01-name">${listEvolutions[0].stage}</span>
        </div>
        <div class="content__description-pokemon__evolution__container__item">
            <span class="content__description-pokemon__evolution__container-item__arrow">&#10162;</span>
            <span id="evolution-01-level"> lvl ${listEvolutions[0].nivel_evolution}</span>
        </div>
        <div class="content__description-pokemon__evolution__container__item">
            <img src="${listEvolutions[1].url_sprite}" id="evolution-02" class="evolution-img"/>
            <span id="evolution-02-name">${listEvolutions[1].stage}</span>
        </div>
        <div class="content__description-pokemon__evolution__container__item">
            <img src="${listEvolutions[1].url_sprite}" id="evolution-03" class="evolution-img"/>
            <span id="evolution-03-name">${listEvolutions[1].stage}</span>
        </div>
        <div class="content__description-pokemon__evolution__container__item">
            <span class="content__description-pokemon__evolution__container-item__arrow">&#10162;</span>
            <span id="evolution-03-level">${listEvolutions[1].nivel_evolution}</span>
        </div>
        <div class="content__description-pokemon__evolution__container__item">
            <img src="${listEvolutions[2].url_sprite}" id="evolution-04" class="evolution-img"/>
            <span id="evolution-04-name">${listEvolutions[2].stage}</span>
        </div>
    `;

    evolutionContainer.innerHTML += htmlForAppendInEvolutionContainer;
}
function insertHtmlWithTwoEvolution(listEvolutions) {
    const htmlForAppendInEvolutionContainer = `
    <div class="content__description-pokemon__evolution__container__item">
        <img src="${listEvolutions[0].url_sprite}" id="evolution-01" class="evolution-img"/>
        <span id="evolution-01-name">${listEvolutions[0].stage}</span>
    </div>
    <div class="content__description-pokemon__evolution__container__item">
        <span class="content__description-pokemon__evolution__container-item__arrow">&#10162;</span>
        <span id="evolution-01-level"> lvl ${listEvolutions[0].nivel_evolution}</span>
    </div>
    <div class="content__description-pokemon__evolution__container__item">
        <img src="${listEvolutions[1].url_sprite}" id="evolution-02" class="evolution-img"/>
        <span id="evolution-02-name">${listEvolutions[1].stage}</span>
    </div>
    `;

    evolutionContainer.innerHTML += htmlForAppendInEvolutionContainer;
}

//função responsável por gerar o html de acordo com a quantidade de evoluções do pokemon
function insertHtmlRandomAmountEvolutions(evolutionStageData) {
    const stagesOfPokemon = evolutionStageData;
    let formattedHtml = "";
    if(stagesOfPokemon === 1) {
        for(let i = 0;i < stagesOfPokemon.length;i++) {
            //condição para garantir que o loop não irá repetir o mesmo indice nos 2 últimos loop.
            if(i === stagesOfPokemon.length-1) {
                break;
            }
            
            formattedHtml = `
                <div class="content__description-pokemon__evolution__container__item">
                    <img src="${stagesOfPokemon[0].sprite}" class="evolution-img"/>
                    <span>${stagesOfPokemon[0].name}</span>
                </div>
                <div class="content__description-pokemon__evolution__container__item">
                    <span class="content__description-pokemon__evolution__container-item__arrow">&#10162;</span>
                    <span> Pedra </span>
                </div>
                <div class="content__description-pokemon__evolution__container__item">
                    <img src="${(((i+1) < stagesOfPokemon.length) ? stagesOfPokemon[i+1].sprite : stagesOfPokemon[i].sprite)}" class="evolution-img"/>
                    <span id="evolution-02-name">${((i+1) < stagesOfPokemon.length) ? stagesOfPokemon[i+1].name : stagesOfPokemon[i].name}</span>
                </div>
            `;
            
            evolutionContainer.innerHTML += formattedHtml;
        }
    } else if(stagesOfPokemon == 0) {
        console.log(stagesOfPokemon)
        formattedHtml = `
            <div class="content__description-pokemon__evolution__container__item">
                <img src="${stagesOfPokemon[0].sprite}" class="evolution-img"/>
                <span>${stagesOfPokemon[0].name}</span>
            </div>
        `;
            
        evolutionContainer.innerHTML += formattedHtml;
    }
    
    
    
    
}