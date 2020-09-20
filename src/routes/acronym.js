let express = require('express')
let router = express.Router()
let jwt = require('jwt-simple')

let { find, create, update, remove, search, search2, findByName } = require('./../database/acronym')

const BAD_REQUEST = 400
const SUCCESS = 200
const DEFAULT_SEARCH_PAGE_SIZE = "50"
const DEFAULT_SEARCH_FROM = "0"
// http://parker0phil.com/2014/10/16/REST_http_4xx_status_codes_syntax_and_sematics/
const DUP = 422
const NOT_FOUND = 404
const SERVER_ERROR = 500
const UNAUTHORIZED = 401
const SUPER_SECRET = "your-256-bit-secret"

/**
 * GET /v1/acronym?from=50&limit=10&search=:search
 * @summary Returns a list of acronyms, paginated using query parameters, response headers indicate if there are more results,returns all acronyms that fuzzy match against `:search`
 * @tags acronym
 * @return 
 */
router.get("", (req, res) => {
    let params
    params = validateSearchParams(req)
    if (params) {
        search2(params.search, params.from, params.limit)
        .then(result=>{
            console.log(result)
            if (result) {
                console.log(result)
                counts = result[0][0]
                counts = counts[0]
                searchResults = result[0][1]
                if (counts.CurrentPage+1<counts.TotalPages) {
                    res.header("more-data", "true")
                }
                res.json(searchResults)

            }
            else {
                res.sendStatus(SERVER_ERROR)
            }
            //res.json(rows)
            //res.sendStatus(SUCCESS)
        })        
    }
    else {
        res.sendStatus(BAD_REQUEST)
    }
})


// GET /acronym/:acronym
// returns the acronym and definition matching `:acronym`

router.get("/:acronym", (req, res) => {
    findByName(req.params.acronym)
    .then(row=> {
        console.log(row)
        if(row) {
            res.json(row)
        }
        else {
            res.sendStatus(NOT_FOUND)
        }        
    })
})

// POST /acronym
// receives an acronym and definition strings
// adds the acronym definition to the db
router.post("", (req,res) => {
    let body = req.body
    // console.log(body)
    if (body.acronym 
        && body.desc
        && body.desc.length>0) {

        let findPromises = []

        body.desc.forEach(element => {
            findPromises.push(
                find(req.body.acronym, element)
            )
        })

        Promise.all(findPromises).then((values)=>{
            let createPromises = []
            //console.log(values)
            for (let index = 0; index < values.length; index++) {
                const element = values[index];
                if (element.length==0) {// add only the creation of missing defintions (Desc)
                    createPromises.push(create(body.acronym, body.desc[index]))
                } 
            }
            if(createPromises.length>0) {
                Promise.all(createPromises).then((values) => {
                    res.sendStatus(SUCCESS)
                })    
            }
            else {
                res.sendStatus(SUCCESS)
            }
        })
    }
    else {
        res.sendStatus(BAD_REQUEST)
    }        
})

// PUT /acronym/:acronym
// receives an acronym and definition strings
// uses an authorization header to ensure acronyms are protected
// updates the acronym definition to the db for `:acronym`
router.put("/:acronym", (req, res)=> {
    let body = req.body
    let token = req.headers['x-access-token'] || req.headers['authorization'] || ""
    
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length).trimLeft();
    }
    
    console.log(token)

    // let secret='your-256-bit-secret'

    try{
        let decoded = jwt.decode(token, SUPER_SECRET);
        console.log(decoded); //=> { foo: 'bar' }    
    }
    catch(err) {
        res.sendStatus(UNAUTHORIZED)
        return 
    }
    
    //console.log('hello')
    if (body.acronym 
        && body.desc
        && body.desc.length>0) {

            let promises = []
        
            promises.push(remove(body.acronym))
            for (let index = 0; index < body.desc.length; index++) {
                const element = body.desc[index];
                promises.push(create(body.acronym, body.desc[index])) 
            }
            // TODO:All this must be a transaction to avoid errors
            Promise.all(promises).then((values) => {
                res.sendStatus(SUCCESS)
            })
        }
    else {
        res.sendStatus(BAD_REQUEST)
    }
})

// DELETE /acronym/:acronym`**
// uses an authorization header to ensure acronyms are protected
router.delete("/:acronym", (req, res)=> {
    let params = req.params
    
    let token = req.headers['x-access-token'] || req.headers['authorization'] || ""
    
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length).trimLeft();
    }

    try{
        let decoded = jwt.decode(token, SUPER_SECRET);
        console.log(decoded); //=> { foo: 'bar' }    
    }
    catch(err) {
        res.sendStatus(UNAUTHORIZED)
        return 
    }

    console.log(params.acronym)
    if (params.acronym) {
        remove(params.acronym)
        .then(rows=>{
            res.sendStatus(SUCCESS)
        })
    }
    else {
        res.sendStatus(BAD_REQUEST)
    }    
})

// validate and returns vaid parameters
function validateSearchParams(req) {
    let res = undefined
    if (req.query.search) {
        let from = parseInt((req.query.from) ? req.query.from : DEFAULT_SEARCH_FROM)
        let limit = parseInt((req.query.limit) ? req.query.limit : DEFAULT_SEARCH_PAGE_SIZE)

        if (Number.isInteger(from)
            && Number.isInteger(limit)) {
            // res.sendStatus(SUCCESS)
            res = {}
            res.from = from
            res.limit = limit
            res.search = req.query.search
        }
    }
    return res
}

module.exports = router