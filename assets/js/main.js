function convertPomonTypesToLi(pokemonTypesArray) {
    
    return pokemonTypesArray.map((typeItem) => `<li class="type">${typeItem.type.name}</li>`)
}

//função para converter a lista com os detalhes dos pokemons da função "getPokemons()" para converter em trecho HTML
function convertPokemonToHtml(pokemon) {
    return `
        <li class="pokemon">
                <span class="number">#${pokemon.id}</span>
                <span class="name">${pokemon.name}</span>
                <div class="detail">
                    <ol class="types">
                        ${convertPomonTypesToLi(pokemon.types).join("")}
                    </ol>
                    <img src="https://img.pokemondb.net/sprites/home/normal/bulbasaur.png" alt="${pokemon.name}">
                </div>
            </li>
    `
}

const IdPokemonListFromHtml = document.getElementById("pokemonList");
//chamando a função "pokeApi.getPokemons" e passando o Array de retorno da função para a lista "pokemonList", que está definida por default como uma lista vazia
pokeApi.getPokemons().then(function (pokemonList = []) {         
    //Usando a função "map()" para converter o atual array "pokemonList", que recebeus o dados do Array retornado da função "getPokemons()", em uma nova Array "newHtml" com um trecho HTML editado. No caso, com a função "map()", substituímos a necessidade de usar o "for" para iterar cada item do Array, o "map() já faz essa iteração para cada item por traz dos panos.     
    const newHtml = pokemonList.map(convertPokemonToHtml).join("");
    //chamando a variável que contem o caminho para o elemento HTML que queremos manipular para acrescentar o newHtml
    IdPokemonListFromHtml.innerHTML += newHtml;
})
//o ".finally" indica o fim da requisição com, ou sem, erro.
.finally(function () {
    console.log("requisição concluída");
})

const x = 10 + 10;
console.log(x);