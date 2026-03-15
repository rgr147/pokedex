const state = {
    view: {
        pokemonList: document.getElementById('pokemonList'),
        loadMoreButton: document.getElementById('loadMoreButton'),
    },
    values: {
        maxRecords: 151, //quantidade máxima de pokemon referente a primeira geração
        limit: 10, //limite de pokemons carregados por vez
        offset: 0, //ponto de partida para carregar pokemon 
    },
}

//manipula o DOM para listar os pokemons da página principal no index.html
function loadPokemonItens(offset,limit) {

    //recebe os dados do pokemon, vindos da função getPokemons(), e faz a manipulação do DOM inserindo os dados
    function convertPokemonToHtml(pokemon) {
        
        const liPokemon = document.createElement('li');
        liPokemon.className = `pokemon ${pokemon.type}`;
        
        const spanNumber = document.createElement('span');
        spanNumber.className = `number`;
        spanNumber.textContent = `#${pokemon.number}`; 
        
        const spanName = document.createElement('span')
        spanName.className = `name`;
        spanName.textContent = `${pokemon.name}`; 
        
        const div = document.createElement('div');
        div.className = 'detail';
        
        const ol = document.createElement('ol');
        ol.className = 'types';
        ol.appendChild(listTypesPokemon(pokemon)); //chamada de função para listar os tipos que o pokemon possui.

        const img = document.createElement('img');
        img.src = `${pokemon.sprite}`;
        img.alt = `Imagem do pokemon ${pokemon.name}`;
        
        div.appendChild(ol);
        div.appendChild(img);
        liPokemon.appendChild(spanNumber);
        liPokemon.appendChild(spanName);
        liPokemon.appendChild(div);
        
        return liPokemon;
    }

    //chamada da função responsável por consultar a API, pokeapi.co, e retornar uma lista de pokemon. por boa prática, já defini o retorno como uma lista vázia, caso a consulta não tenha resposta. 
    pokeApi.getPokemons(offset,limit).then(function (listPokemon = []) {  
        const fragment = document.createDocumentFragment();
        
        //iterando a lista retornada para indetificar os dados necessários de cada pokemon 
        listPokemon.forEach(pokemon => {
            const pokemonElement = convertPokemonToHtml(pokemon);
            fragment.appendChild(pokemonElement); //adiciona a estrutura de cada pokemon iterado em um nó do DOM fora da arvore principal  
        });

        //adicionando toda estrutura de elementos armazenados dentro do container fragment, no DOM da página de uma única vez 
        state.view.pokemonList.appendChild(fragment);
        
    });
}

loadPokemonItens(state.values.offset, state.values.limit);

//evento que identifica clique no bottão responsável por carregar mais pokemons
state.view.loadMoreButton.addEventListener('click', () => {
    state.values.offset += state.values.limit;
    let maxNextPag = state.values.offset+state.values.limit;
    if (maxNextPag >= state.values.maxRecords) {
        const newLimit =  state.values.maxRecords - state.values.offset;
        loadPokemonItens(state.values.offset, newLimit);
        state.view.loadMoreButton.parentElement.removeChild(state.view.loadMoreButton)
    
    } else {
        loadPokemonItens(state.values.offset, state.values.limit);
    }
})

//identifica qual o pokemon clicado para que possa direcionar para a página-about com os dados do poekmon selecionado. 
state.view.pokemonList.addEventListener("click", (event) => {
    //considera a 'li' para saber qual o pokemon selecionado 
    if (event.target.closest("li.pokemon")){
        const pokemon = event.target.closest("li.pokemon");
        //armazena o nome do pokemon que consta na 'li' selecionada para puxar os dados na próxima página.
        const pokemonName = pokemon.querySelector(".name").textContent;
        //direcionando para a página do pokemon selecionado. Utilizando o nome como string.
        window.location.href = (`pagina-about.html?name=${pokemonName}`);
    }
});

//recebe os dados do pokemon, vindos da função convertPokemonToHtml(), para identificar e tratar a quantidade de tipos que o pokemon possui 
function listTypesPokemon(pokemon) {
    if (pokemon.types.length > 1) {
            const fragment = document.createDocumentFragment();

            for (let type = 0; type < pokemon.types.length; type++) {
                const liType = document.createElement('li');
                liType.className = `type ${pokemon.types[type]}`;
                liType.textContent = `${pokemon.types[type]}`;
                fragment.appendChild(liType);
            }
            return fragment;
        } 
        else {
            const liType = document.createElement('li');
            liType.className = `type ${pokemon.type}`;
            liType.textContent = `${pokemon.type}`;
            return liType;
        };
}