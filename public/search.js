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
currentPage = null
numOfPages = null
resultArray = null

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

function paginateMenu() {
    $(".pageButtons").empty()
    numOfPages = Math.ceil(resultArray.length / 9)
    $(".pageButtons").append("<button class='firstPage'>First</button>")
    $(".pageButtons").append("<button class='previousPage'>Previous</button>")
    $(".pageButtons").append("<span class='allPages'></span>")
    $(".pageButtons").append("<button class='nextPage'>Next</button>")
    $(".pageButtons").append("<button class='lastPage'>Last</button>")
    for (i = 1; i <= numOfPages; i++) {
        page = `<button class="pages" value="${i}">${i}</button>`
        $(".allPages").append(page)
    }

    $(".firstPage").click(firstPage)
    $(".previousPage").click(previousPage)
    $(".nextPage").click(nextPage)
    $(".lastPage").click(lastPage)
    pokemonsForPage(currentPage)
}


function processPokemons(data) {
    currentPage = 1
    resultArray = data.pokemon
    paginateMenu()
    
}

async function pokemonsForPage(pageId) {
    searchedPokemons = ''
    $("main").empty

    console.log(resultArray)
    
    startIndex = 9 * (pageId - 1)
    if (pageId == numOfPages) {
        stopIndex = resultArray.length - 1
    } else {
        stopIndex = 9 * (pageId - 1) + 9 - 1
    }

    for (i = startIndex; i <= stopIndex; i++) {
        // if (i % 3 == 0) {
        //     searchedPokemons += '<div class="pokemonCol">'
        // }
        await $.ajax({
            type: 'GET',
            url: resultArray[i].pokemon.url,
            success: populatePokemon
        })

        // if (i % 3 == 2) {
        //     searchedPokemons += '</div>'
        // }
    }
    $('main').html(searchedPokemons)
}

function displayPokemon(type_url) {
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
    $(".pageButtons").empty()
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
    $(".pageButtons").empty()
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

function pageButton() {
    page = $(this).attr("value")
    pokemonsForPage(page)
    currentPage = page
}

function firstPage() {
    currentPage = 1
    pokemonsForPage(currentPage)
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--
    }
    pokemonsForPage(currentPage)
}

function nextPage() {
    if (currentPage < numOfPages) {
        currentPage++
    }
    pokemonsForPage(currentPage)
}

function lastPage() {
    pokemonsForPage(numOfPages)
}

function setup() {
    populateTypes()
    $("#idSearch").click(searchById)
    $("#nameSearch").click(searchByName)
    $("body").on("click", ".pages", pageButton)
    $("#pokeType").change(() => {
        displayPokemon($("#pokeType option:selected").val())
    })
}

$(document).ready(setup)