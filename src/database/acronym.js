const { knex, wtf } = require('./con')


function search2(search, from=0, pageSize=50, threshold=2) {
    return knex.raw(
        'Call search(?,?,?,?)',
        [search, from, pageSize, threshold]
      )
}

function search(search, from=0, pageSize=50, threshold=2) {
    return knex('WTF')
        .whereRaw('  LEVENSHTEIN(Name,?)<? limit ? offset ?', [search, threshold, pageSize, from])
}

function find(name, desc) {
    return knex('WTF')
        .where('Name', '=', name)
        .andWhere('Desc', '=', desc)
}

function findByName(name) {
    return knex('WTF')
        .where('Name', '=', name)
}
function create(name, desc) {
    return knex('WTF')
        .insert({Name:name, Desc:desc })
}

function update(name, desc) {
    return knex('WTF')
        .where({'Name':name})
        .update({Desc:desc},['Id'])
}

function remove(name) {
    return knex('WTF')
        .where({Name:name})
        .del()
}

module.exports = { find, create, update, remove, search, search2, findByName }