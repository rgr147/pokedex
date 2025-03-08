const pokeApiDetails = {};

//Função responsável por criar o o objeto pokemon com todas as informações necessárias, usando como base o objeto json recebido da função que a chamou.
async function convertPokeApiDetailToPokemonDetailed(jsonBody /**name,id,types,type,sprite,height,weight,abilities*/) {
    const poke = new PokemonDetailed()

    poke.name = jsonBody.name;//buscando o nome do pokemon no PokeApi; 
    poke.id = jsonBody.id;//buscando o ID do pokemon no PokeApi;

    const types = jsonBody.types.map((typeSlot) => typeSlot.type.name);//buscando os tipos do pokemon no PokeAPi;
    const [type] = types;//identificando o tipo principal do pokemon
    const breeding = await pokeApiDetails.breedingInfo(poke.name);
    const specie = await pokeApiDetails.getSpecie(poke.id);

    poke.types = types;
    poke.type = type; 
    poke.sprite = jsonBody.sprites.other.dream_world.front_default; //busanco a imagem do pokemon no PokeApi;
    poke.height = jsonBody.height; //buscando a altura do pokemon no PokeAPI;
    poke.weight = jsonBody.weight;//buscando o peso do pokemon no PokeAPI;
    poke.abilities = jsonBody.abilities.map((abilitiesSlot) => abilitiesSlot.ability.name);
    poke.gender = breeding.gender;
    poke.eggGroups = breeding.eggGroup;
    poke.eggCicle = breeding.eggCicle;
    poke.specie = specie;

    const stats = await pokeApiDetails.calculateTotalBaseStats(jsonBody);

    poke.stats = stats;

    return poke;
}

//função para calcular o total do Status Base do pokemon
pokeApiDetails.calculateTotalBaseStats = (jsonBody) => {
    let stats = Object.fromEntries(
        jsonBody.stats.map(statsSlot => [statsSlot.stat.name, statsSlot.base_stat])
    );
    
    let total = 0;
    Object.values(stats).forEach(value => total += value);

    stats["total"] = total;

    return stats;
}

/*função responsável por puxar as informações de Breeding da API  PokeAPI */
pokeApiDetails.breedingInfo = (pokemonName) => {
    const url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`; 

    return fetch(url)    
        .then(function (response) {
            return response.json();
        })
        .then(function (responseJson) { 
            
            const genderRate = responseJson.gender_rate;
            const groups = responseJson.egg_groups.map(groupSlot => groupSlot.name);
            
            const eggGroup = groups[0];
            const eggCicle = groups[1];

            const femaleRate = genderRate === -1 ? 0 : (genderRate / 8) * 100;
            const maleRate = genderRate === -1 ? 0 : 100 - femaleRate;
        
            const gender = `♀️ ${femaleRate.toFixed(1)}% / ♂️ ${maleRate.toFixed(1)}%`;
            // const eggCicle = eggGroups.map(group => group.name).join(", ");

            return {
                gender,
                eggGroup,
                eggCicle
            }
        })
}

pokeApiDetails.getSpecie = (idPokemon) => {
    const url = `https://pokeapi.co/api/v2/pokemon-species/${idPokemon}/`;
    
    // requisição HTTP para Poke APi retornar uma Promise com o corpo da requiseção(em JSON)
    return fetch(url)
        // tratamento da Promise para aconverte-la em um objeto javascript 
        .then(function (response) {
            return response.json();
        })
        .then(function (responseJson) {
            return responseJson.genera[7].genus;
        })
        .catch(function (error) {
            console.error(`Erro ao solicitar a specie de pokemon: ${error}`);
        })
}

//função responsável por receber o parametro "name" com o nome do pokemon passado via url e realizar o get via http com a API PokeAPI
pokeApiDetails.getDataPokeApi = (nameParam) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${nameParam}`;

    return fetch(url)
    .then(function (response) {
        return response.json();
    })
    .then(function (jsonBody) { 
        console.log(jsonBody);
        return convertPokeApiDetailToPokemonDetailed(jsonBody);
    })
    .then(function (poke) {
        inputDetailsInHtml(poke);
    })
}