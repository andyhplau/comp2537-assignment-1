const backgroundColors = {
    grass: '#5FBD58',
    bug: '#92BC2C',
    dark: '#595761',
    dragon: '#0C69C8',
    electric: '#F2D94E',
    fairy: '#EE90E6',
    fighting: '#D3425F',
    fire: '#DC872F',
    flying: '#A1BBEC',
    ghost: '#5F6DBC',
    ground: '#DA7C4D',
    ice: '#75D0C1',
    normal: '#A0A29F',
    poison: '#B763CF',
    psychic: '#FF2CA8',
    rock: '#A38C21',
    steel: '#5695A3',
    water: '#539DDF'
}
pokemonTypes = ''


function populatePokemon(data) {
    searchedPokemons += '<div class="cardContainer">'

    if (data.types.length == 1) {
        searchedPokemons += `<div class="pokemonContainer" style="background-color: ${backgroundColors[data.types[0].type.name]}">`
    } else {
        searchedPokemons += `<div class = "pokemonContainer"
        style = "background-image: linear-gradient(to bottom right, ${backgroundColors[data.types[0].type.name]}, ${backgroundColors[data.types[1].type.name]}">`
    }
    // console.log(data)
    searchedPokemons += `
    <a href="./pokemon/${data.id}">
    <h1 class="pokemonName">${data.name.toUpperCase()}</h1>
    <img src="${data.sprites.other['official-artwork'].front_default}">
    <h2 class="pokemonID">${data.id}</h2>
    </a>
    </div>
    </div>
    `
}

async function processPokemons(data) {
    for (i = 0; i < data.pokemon.length; i++) {
        if (i % 3 == 1) {
            searchedPokemons += '<div class="pokemonCol">'
        }
        await $.ajax({
            type: 'GET',
            url: data.pokemon[i].pokemon.url,
            success: populatePokemon
        })

        if (i % 3 == 0) {
            searchedPokemons += '</div>'
        }
    }
    $('main').html(searchedPokemons)
}

function displayPokemon(type_url) {
    searchedPokemons = ''
    $("main").empty()
    $.ajax({
        type: 'GET',
        url: type_url,
        success: processPokemons
    })
}

function processTypes(data) {
    for (i = 0; i < (data.results.length - 2); i++) {
        pokemonTypes += `<option value="${data.results[i].url}">${data.results[i].name}</option>`
    }
    $("#pokeType").html(pokemonTypes)
}

async function populateTypes() {
    await $.ajax({
        type: 'GET',
        url: 'https://pokeapi.co/api/v2/type/',
        success: processTypes
    })
    displayPokemon($("#pokeType option:selected").val())
}

async function searchById() {
    searchedPokemons = ''
    $("main").empty()
    id = $("#pokemonId").val()
    if ($.isNumeric(id)) {
        searchedPokemons += '<div class="pokemonCol">'
        console.log(`https://pokeapi.co/api/v2/pokemon/${id}`)
        await $.ajax({
            type: 'GET',
            url: `https://pokeapi.co/api/v2/pokemon/${id}`,
            success: populatePokemon
        })
        searchedPokemons += '</div>'
        $("main").html(searchedPokemons)
    } else {
        alert('Your input is not numeric!')
    }
}

async function searchByName() {
    searchedPokemons = ''
    $("main").empty()
    pokeName = $("#pokemonName").val()
    searchedPokemons += '<div class="pokemonCol">'
    console.log(`https://pokeapi.co/api/v2/pokemon/${pokeName}`)
    await $.ajax({
        type: 'GET',
        url: `https://pokeapi.co/api/v2/pokemon/${pokeName}`,
        success: populatePokemon
    })
    searchedPokemons += '</div>'
    $("main").html(searchedPokemons)
}

function setup() {
    populateTypes()
    $("#idSearch").click(searchById)
    $("#nameSearch").click(searchByName)
    $("#pokeType").change(() => {
        displayPokemon($("#pokeType option:selected").val())
    })
}

$(document).ready(setup)