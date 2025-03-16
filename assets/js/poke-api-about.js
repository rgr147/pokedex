const pokeApiDetails = {};

//Função responsável por criar o o objeto pokemon com todas as informações necessárias, usando como base o objeto json recebido da função que a chamou.
async function convertPokeApiDetailToPokemonDetailed(jsonBody /**name,id,types,type,sprite,height,weight,abilities*/) {
    const poke = new PokemonDetailed()
    console.log(jsonBody);
    //dados utilizados na pagina-about
    const types = jsonBody.types.map((typeSlot) => typeSlot.type.name);//buscando os tipos do pokemon no PokeAPi;
    const [type] = types;//identificando o tipo principal do pokemon
    const breeding = await pokeApiDetails.breedingInfo(jsonBody.name);
    const specie = await pokeApiDetails.getSpecie(jsonBody.id);
    poke.name = jsonBody.name;//buscando o nome do pokemon no PokeApi; 
    poke.id = jsonBody.id;//buscando o ID do pokemon no PokeApi;
    poke.types = types;
    poke.type = type; 
    console.log("link sprite principal pokemon: "+ jsonBody.sprites.other.dream_world.front_default);
    poke.sprite = jsonBody.sprites.other.dream_world.front_default; //busanco a imagem do pokemon no PokeApi;
    
    //dados utilizados na div about    
    poke.height = jsonBody.height; //buscando a altura do pokemon no PokeAPI;
    poke.weight = jsonBody.weight;//buscando o peso do pokemon no PokeAPI;
    poke.abilities = jsonBody.abilities.map((abilitiesSlot) => abilitiesSlot.ability.name);
    poke.gender = breeding.gender;
    poke.eggGroups = breeding.eggGroup;
    poke.eggCicle = breeding.eggCicle;
    poke.specie = specie;

    //dados utilizados na div base stats
    const stats = await pokeApiDetails.calculateTotalBaseStats(jsonBody);
    poke.stats = stats;
    poke.totalPercentage = ((poke.stats.total / 600) * 100).toFixed();
    poke.defenses = await pokeApiDetails.getDataAboutDefenses(jsonBody.types[0].type.url)
    
    teste = pokeApiDetails.getEvolutionSprites(jsonBody.species.url); //passando o link que contém os dados para buscar a cadeia evoutiva do pokemon

    return poke;
}
//função que retorna a url de cada sprite dos pokemons
pokeApiDetails.getUrlSprites = (listNames) => {
    const url = "https://pokeapi.co/api/v2/pokemon/";
    const names = listNames;
    const listSprites = [];

    names.forEach(name =>{
        const urlPokemon = `${url}${name}`;
        fetch(urlPokemon)
        .then(function(response){
            return response.json();
        })
        .then(function(responseJson){
            listSprites.push(responseJson.sprites.other.dream_world.front_default);
        })
    })
    
    return listSprites;
}



//função para identificar o nome de cada pokemon da cadeia evolutiva
pokeApiDetails.getEvolutionNamesPokemon = (urlEvolutionChain) => {
    const url = urlEvolutionChain;
    const listNames = [];

    return fetch(url)
        .then(function (response){
            return response.json();
        })
        .then(function (responseJson){
            if(responseJson.chain.evolves_to != "") {
                listNames.push(responseJson.chain.species.name);
                listNames.push(responseJson.chain.evolves_to[0].species.name);
                if(responseJson.chain.evolves_to[0].evolves_to != "") {
                    listNames.push(responseJson.chain.evolves_to[0].evolves_to[0].species.name);
                }

                return pokeApiDetails.getUrlSprites(listNames);

            } else if (responseJson.chain.evolves_to == "") {
                console.log("No evolution chain found");
            }
        })
}
//função retorna sprites com todas evoluções do pokemon
pokeApiDetails.getEvolutionSprites = (url) => {
    const urlSpeciesPokemon = url;
    const listEvolution = [];
    const listSprites = [];

    return fetch(urlSpeciesPokemon)
        .then(function(response){
            return response.json();
        })
        .then(function (responseJson){
            return pokeApiDetails.getEvolutionNamesPokemon(responseJson.evolution_chain.url);//passa o link contendo os dados sobre a corrente evolutiva do pokemon
        })

}

//função responsável por receber o dicionário com a lista de relaçãoes sobre as defesas do pokemon e retornar um texto formatado com as informações para ser usado no HTML
pokeApiDetails.formatTextAboutDefenses = (dictRelations) => {
    const dicionario = dictRelations;

    textFormattedForHtml = ``;

    const linesList = [];
    for(let key in dicionario) {
        if(key == "double_damage_from" && dicionario["double_damage_from"] != "") {
            linesList.push("Weak against: "+ dicionario[key])

        } else if (key == "half_damage_from" && dicionario["half_damage_from"] != "") {
            linesList.push("half damage against: "+ dicionario[key])

        } else if (key == "no_damage_from" && dicionario["no_damage_from"] != "")
            linesList.push("Resist against: "+ dicionario[key]);
    }

    for(let i = 0; i < linesList.length; i++) {
        textFormattedForHtml += `<p id="p${i+1}">${linesList[i].split(",").join(", ")}</p> \n`;
    }

    return textFormattedForHtml;
}

//função responsável por puxar do PokeAPI as informações sobre a defesa do pokemon, fraquesas e resistrencias
pokeApiDetails.getDataAboutDefenses = (urlType) => {
    const url = `${urlType}`;

    return fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (responseJson) {
            const relations = responseJson.damage_relations; //variável que recebe o objeto com os dados referente a dano/defesa. 
            
            const dictRelations = [] //dicionário com o nome da key como chave, e a lista de tipos relaciona a key como valor
            const listValidation = []; //lista para armazenar o nome de cada key analisada para tomada de decisão
            // Object.entries para iterar sobre todas as chaves e valoes
            Object.entries(relations).forEach(([key, value]) => {
                if(key in listValidation == false) {
                    const typsList = [] //recebe os tipos relacionados a cada key
                    for(let i = 0; i < value.length; i++) { 
                        typsList.push(value[i].name)
                    }
                    dictRelations[key] = typsList
                }
            })
            textFormattedForHtml = pokeApiDetails.formatTextAboutDefenses(dictRelations)


            return textFormattedForHtml
        })
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
            //dados utilizados na div about            
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
        return convertPokeApiDetailToPokemonDetailed(jsonBody);
    })
    .then(function (poke) {
        inputDetailsInHtml(poke);
    })
}

