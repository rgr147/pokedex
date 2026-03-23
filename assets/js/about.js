//organizando as referencias ao DOM
const state = {
    view: {
        //navegação
        backButton: document.getElementById('back-button'), //elemento botão retorno para index.html
        linkAbout: document.getElementById('link-about'),
        linkBaseStats: document.getElementById('link-base-stats'),
        linkEvolution: document.getElementById('link-evolution'),
        linkMoves: document.getElementById('link-moves'),
        allLinks: document.querySelectorAll('.content__description-pokemon__nav a'),

        //conteúdo/containers
        contentDivs: document.querySelectorAll('.content-div'),
        baseStatsDiv: document.getElementById('base-stats'),
        aboutDiv: document.getElementById('about'),
        evolutionDiv: document.getElementById('evolution'),
        movesDiv: document.getElementById('moves'),

        //background
        background: document.querySelector('.container'),
                
        //informações básicas
        name: document.getElementById('name'),
        number: document.getElementById('number'),
        types: document.getElementById('types'), //elemento com ul com os tipos do pokemon
        sprite: document.getElementById('sprite'), //elemento com imagem do pokemon

        //aba about
        specie: document.getElementById('specie'),
        height: document.getElementById('height'),
        weight: document.getElementById('weight'),
        abilities: document.getElementById('abilities'),
        gender: document.getElementById('gender'),
        eggGroups: document.getElementById('eggGroups'),
        eggCicle: document.getElementById('eggCicle'),

        //aba base stats
        hp: document.getElementById('base-stats-hp'),
        attack: document.getElementById('base-stats-attack'),
        defense: document.getElementById('base-stats-defense'),
        attackSpeed: document.getElementById('base-stats-sp-attack'),
        defenseSpeed: document.getElementById('base-stats-sp-defense'),
        speed: document.getElementById('base-stats-speed'),
        total: document.getElementById('base-stats-total'),
        defenses: document.querySelector('.content__description-pokemon__base-stats__observation'),

        //aba evolution
        evolutionContainer: document.getElementById('evolution-container'),


        //aba moves
        listDescriptionMoves: document.getElementById('moves-list'),
    },
    values: {
        //recebe o nome do pokemon clicado na  index.html via url
        currentPokemonName: new URLSearchParams(window.location.search).get('name'),
        homePage: './index.html',
    },
}

//ouvindo cliques no menu de navegação das estatísticas 
state.view.linkEvolution.addEventListener('click', () => {
    selectEvolution();
});

state.view.linkBaseStats.addEventListener("click", () => {
    selectBaseStats();
});

state.view.linkAbout.addEventListener("click", () => {
    selectAbout();
});
state.view.linkMoves.addEventListener("click", () => {
    selectMoves();
});

//ouvindo botão de retorno para a home page
state.view.backButton.addEventListener("click", () => {
    window.location.href = state.values.homePage;
})

//mostra as estatísticas da DIV evolution e oculta as demais. adiciona efeito de link ativado
function selectEvolution() {
    state.view.allLinks.forEach(function(link) {
        link.classList.remove("link-active");
        link.classList.add("link-inactive");
    })

    state.view.linkEvolution.classList.remove("link-inactive");
    state.view.linkEvolution.classList.add("link-active");

    state.view.contentDivs.forEach(function(div) {
        div.classList.add("hidden");
    })
    state.view.evolutionDiv.classList.remove('hidden');
}

//mostra estatísticas referente a DIV About e oculta as demais DIVs. adiciona efeito de link ativado
function selectAbout() {
    state.view.allLinks.forEach(function(link) {
        link.classList.remove("link-active");
        link.classList.add("link-inactive");
    })
    state.view.linkAbout.classList.remove("link-inactive");
    state.view.linkAbout.classList.add("link-active");

    state.view.contentDivs.forEach(function(div) {
        div.classList.add("hidden");
    })
    state.view.aboutDiv.classList.remove("hidden");
}

//mostra estatísticas da DIV Base Stats e oculta as demais. adiciona efeito de link ativado na DIV
function selectBaseStats() {
    state.view.allLinks.forEach(function(link) {
        link.classList.remove("link-active");
        link.classList.add("link-inactive");
    })
    state.view.linkBaseStats.classList.remove("link-inactive");
    state.view.linkBaseStats.classList.add("link-active");

    state.view.contentDivs.forEach(function(div) {
        div.classList.add("hidden");
    })
    state.view.baseStatsDiv.classList.remove("hidden");    
}

//mostra estatísticas da DIV Moves e oculta as demais. adiciona efeito de link ativado na DIV
function selectMoves() {
    const {allLinks, linkMoves, contentDivs, movesDiv} = state.view;

    allLinks.forEach(function(link) {
        link.classList.remove("link-active");
        link.classList.add("link-inactive");
    })
    linkMoves.classList.remove("link-inactive");
    linkMoves.classList.add("link-active");

    contentDivs.forEach(function(div) {
        div.classList.add("hidden");
    })
    movesDiv.classList.remove("hidden");
}


//insere as informações básicas do pokemon na página
function inputDetailsInHtml(poke) {
    const {name, background, sprite} = state.view;
    
    name.textContent = poke.name;
    background.classList.add(poke.type);
    sprite.src = poke.sprite;
    sprite.alt = `Imagem do pokemon ${poke.name}`;
    
    insertTypes(poke.types); //chamada de função para inserir os tipos
    formatIdPokemon(poke.id); //chamada de função para formatar o id
    inputDataAbout(poke); //inserindo os dados da div about
    inputBaseStatsDataInHtml(poke); //inserindo os dados da div base stats
    insertDataEvolutionIntoHtml(poke); //inserindo os dados da div base stats
    insertDataMovesIntoHtml(poke);
}

//formata o numero do id para adicionar o # e permancer com 3 digitos
function formatIdPokemon(id){
    const idString = id.toString();
    if(idString.length < 2){
        state.view.number.textContent = `#00${idString}`;
    } else if(idString.length < 3) {
        state.view.number.textContent = `#0${idString}`;
    } else {
        state.view.number.textContent = `#${idString}`;
    }
}

//faz a iteração dos tipos e insere no html 
function insertTypes(types) {
    const fragment = document.createDocumentFragment();
    
    types.forEach(type => {
        const li = document.createElement('li');
        li.className = `content__pokemon__details__type ${type}`;
        li.textContent = type;
        fragment.appendChild(li);
    });
    state.view.types.appendChild(fragment);
}

//preenchendo as informações detalhadas da aba About
function inputDataAbout(poke) {
    const {specie, height, weight, abilities, gender, eggGroups, eggCicle} = state.view;
    
    specie.textContent = poke.specie;
    height.textContent = `${(poke.height/10).toFixed(2)} m`;
    weight.textContent = `${(poke.weight/10).toFixed(2)} kg`;
    abilities.textContent = poke.abilities.join(", ");
    gender.textContent =poke.gender;
    eggGroups.textContent = poke.eggGroups;
    eggCicle.textContent = poke.eggCicle;
}

//preenchendo as informações detalhadas da aba Base Stats
function inputBaseStatsDataInHtml(poke) {
    const {hp, attack, defense, attackSpeed, defenseSpeed, speed, total, defenses} = state.view;
    
    hp.innerText = poke.stats.hp;
    attack.innerText = poke.stats.attack;
    defense.innerText = poke.stats.defense;
    attackSpeed.innerText = poke.stats["special-attack"];
    defenseSpeed.innerText = poke.stats["special-defense"];
    speed.innerText = poke.stats.speed;
    total.innerText = poke.stats.total;
    defenses.innerHTML += poke.defenses;
    addAnimationBars(poke); //animação com efeito de carregamento das barras de estatisticas
}
//Função que insere trecho HTML com os detalhes da evolução do pokemon
function insertDataEvolutionIntoHtml(poke) {

    const fragment = document.createDocumentFragment();

    try {
        const numberOfForms = Object.entries(poke.evolves).length; 
        
        if(numberOfForms == 1) {

            const figure = document.createElement('figure');
            figure.classList = 'content__description-pokemon__evolution__container__item';
            
            const img = document.createElement('img');
            img.classList = 'evolution-img';
            img.src = `${poke.evolves[0].sprite}`;
            
            const span = document.createElement('span');
            span.textContent = `${poke.evolves[0].name}`;
            

            figure.appendChild(img, span);

            fragment.appendChild(figure);
            
        } else if(numberOfForms <= 3) {
            
            for(let i = 0; i < numberOfForms; i++){
            
                if(i < numberOfForms - 1){

                    const figureLeft = document.createElement('figure');
                    figureLeft.classList = 'content__description-pokemon__evolution__container__item';
                    
                    const imgLeft = document.createElement('img');                    
                    imgLeft.classList = 'evolution-img';
                    imgLeft.src = `${poke.evolves[i].sprite}`;

                    const figcaptionLeft = document.createElement('figcaption');
                    figcaptionLeft.textContent = `${poke.evolves[i].name}`;

                    figureLeft.appendChild(imgLeft);
                    figureLeft.appendChild(figcaptionLeft);
                    
                    const divSeta = document.createElement('div');
                    divSeta.classList = 'content__description-pokemon__evolution__container__item';
                    divSeta.id = 'evolution-seta';
                    
                    const spanSeta = document.createElement('span');
                    spanSeta.classList = 'content__description-pokemon__evolution__container-item__arrow';
                    spanSeta.textContent = '→';
                    
                    const spanLevel = document.createElement('span');
                    spanLevel.textContent = `level ${poke.evolves[i].levelEvolves}`;
                    
                    divSeta.appendChild(spanSeta);
                    divSeta.appendChild(spanLevel);
                    
                    const figureRight = document.createElement('figure');
                    figureRight.classList = 'content__description-pokemon__evolution__container__item';
                    
                    const imgRight = document.createElement('img');
                    imgRight.classList = 'evolution-img';
                    imgRight.src = `${(i < numberOfForms - 1) ? poke.evolves[i+1].sprite : poke.evolves[i].sprite}`;
                    
                    const figcaptionRight = document.createElement('figcaption');
                    figcaptionRight.textContent = `${(i < numberOfForms - 1) ? poke.evolves[i+1].name : poke.evolves[i].name }`;
                    
                    figureRight.append(imgRight, figcaptionRight);
                    
                    fragment.append(figureLeft, divSeta, figureRight);
                    
                }
            }
        } else {

            for(let i = 0; i < numberOfForms; i++){

                if(i < numberOfForms - 1){

                    const figureLeft = document.createElement('figure');
                    figureLeft.classList = 'content__description-pokemon__evolution__container__item';

                    const imgLeft = document.createElement('img');
                    imgLeft.classList = 'evolution-img';
                    imgLeft.src = `${poke.evolves[0].sprite}`;

                    const spanLeft = document.createElement('span');
                    spanLeft.textContent = `${poke.evolves[0].name}`;

                    figureLeft.appendChild(imgLeft);
                    figureLeft.appendChild(spanLeft);
                    
                    const divSeta = document.createElement('div');
                    divSeta.classList = 'content__description-pokemon__evolution__container__item';
                    divSeta.id = 'evolution-seta';
                    
                    const spanSeta = document.createElement('span');
                    spanSeta.classList = 'content__description-pokemon__evolution__container-item__arrow';
                    spanSeta.textContent = '→';
                    
                    const spanLevel = document.createElement('span');
                    spanLevel.textContent = `level ${poke.evolves[i].levelEvolves}`;
                    
                    divSeta.appendChild(spanSeta);
                    divSeta.appendChild(spanLevel);
                    
                    const figureRight = document.createElement('figure');
                    figureRight.classList = 'content__description-pokemon__evolution__container__item';
                    
                    const imgRight = document.createElement('img');
                    imgRight.classList = 'evolution-img';
                    imgRight.src = `${(i < numberOfForms - 1) ? poke.evolves[i+1].sprite : poke.evolves[i].sprite}` ;
                    
                    const spanRight = document.createElement('span');
                    spanRight.textContent = `${(i < numberOfForms - 1) ? poke.evolves[i+1].name : poke.evolves[i].name}`;
                    
                    figureRight.appendChild(imgRight);
                    figureRight.appendChild(spanRight);
                    
                    fragment.appendChild(figureLeft);
                    fragment.appendChild(divSeta);
                    fragment.appendChild(figureRight);
                }
            }
        }

        state.view.evolutionContainer.appendChild(fragment);

    } catch(error) {
        console.log('erro ao executar pokemon com 3 evoluções');
        console.log(error);
    }
}
function insertDataMovesIntoHtml(poke) {
    const NumberOfMoves = poke.abilitiesDescription.length;
    const listOfDescriptionMoves = poke.abilitiesDescription;
    const fragment = document.createDocumentFragment();

    for(let i = 0; i < NumberOfMoves; i++){
        const move = Object.entries(listOfDescriptionMoves[i]);
        
        const listItem = document.createElement("li");
        
        const p = document.createElement('p');
        p.textContent = `${move[0][0]}`;
        
        const span = document.createElement('span');
        span.textContent = `${move[0][1]}`;

        listItem.append(p, span);
        fragment.appendChild(listItem)
    }
    state.view.listDescriptionMoves.appendChild(fragment);
}

function init () {
    //função responsável por consultar os trazer os dados do pokemon da API PokeAPI.co
    pokeApiDetails.getDataPokeApi(state.values.currentPokemonName);
}

init();

//