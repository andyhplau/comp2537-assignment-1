const exp = require('constants')
const express = require('express')
const app = express()
const https = require('https')

app.listen(process.env.PORT || 5000, (err) => {
    if (err)
        console.log(err)
})

app.use(express.static('./public'))

app.get('/pokemon/:id', function (req, res) {
    const url = `https://pokeapi.co/api/v2/pokemon/${req.params.id}`
    data = '';

    https.get(url, (https_res) => {
        https_res.on('data', (chunk) => {
            data += chunk
        })

        https_res.on('end', () => {
            data = JSON.parse(data)

            pokemonAbilities = data.abilities.map((abilityObj) => {
                return abilityObj.ability.name
            })

            pokemonType = data.types.map((typeObj) => {
                return typeObj.type.name
            })

            pokemonHp = data.stats.filter((statsObj) => {
                return statsObj.stat.name == 'hp'
            }).map((hpObj) => {
                return hpObj.base_stat
            })

            pokemonAttack = data.stats.filter((statsObj) => {
                return statsObj.stat.name == 'attack'
            }).map((attackObj) => {
                return attackObj.base_stat
            })

            pokemonDefense = data.stats.filter((statsObj) => {
                return statsObj.stat.name == 'defense'
            }).map((defenseObj) => {
                return defenseObj.base_stat
            })

            pokemonSpeed = data.stats.filter((statsObj) => {
                return statsObj.stat.name == 'speed'
            }).map((speedObj) => {
                return speedObj.base_stat
            })

            res.render('pokemon.ejs', {
                'id': data.id,
                'name': data.name.toUpperCase(),
                'img_path': data.sprites.other["official-artwork"]["front_default"],
                'ability': pokemonAbilities,
                'type': pokemonType,
                'hp': pokemonHp,
                'attack': pokemonAttack,
                'defense': pokemonDefense,
                'speed': pokemonSpeed,
                'height': data.height,
                'weight': data.weight
            })
        })
    })
})