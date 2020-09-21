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
 * @swagger
 * /v1/acronym:
 *  get:
 *   tags:
 *      - acronym, search
 *   description: Returns a list of acronyms, paginated using query parameters, response headers indicate if there are more results,returns all acronyms that fuzzy match against `:search`
 *   produces:
 *      - application/json
 *   parameters:
 *      - name: search
 *        description: keyword to search for
 *        required: true
 *        type: string
 *        in: query
 *      - name: from
 *        description: starting record
 *        required: false
 *        type: integer
 *        in: query
 *        minimum: 0
 *        default: 0
 *      - name: limit
 *        description: page size or limit of the records to be displayed
 *        required: false
 *        in: query
 *        default: 50
 *        minimum: 1
 *   responses:
 *      200:
 *          description: An array of acronyms the match the search parameter
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
        })        
    }
    else {
        res.sendStatus(BAD_REQUEST)
    }
})


/**
 * @swagger
 * /v1/acronym/{acronym}:
 *      get:
 *          tags:
 *              -   acronym
 *          description: returns the acronym and definition matching acronym parameter
 *          produces:
 *              - application/json
 *          parameters:
 *              - name: acronym
 *                description: exact name of the acronym
 *                required: true
 *                in: path
 *          responses:
 *              200:
 *                  description: When search was done
 */
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

/**
 * @swagger
 * /v1/acronym:
 *      post:
 *          tags:
 *              - acronym
 *          summary: Adds the acronym definition to the db
 *          produces:
 *              - application/json
 *          consumes:
 *              - application/json
 *          parameters:
 *              - in: body
 *                name: acronym
 *                schema:
 *                    type: object
 *                    required:
 *                      - acronym
 *                      - desc
 *                    properties:
 *                          acronym:
 *                               type: string
 *                          desc:
 *                               type: array
 *                               items:
 *                                  type: string
 *          responses:
 *              200:
 *                  description: new acronym created
 */
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

/**
 * @swagger
 * /v1/acronym/{acronym}:
 *      put:
 *          tags:
 *              - acronym
 *          summary: Updates the acronym definition to the db for `:acronym`, It uses an authorization header to ensure acronyms are protected
 *          produces:
 *              - application/json
 *          consumes:
 *              - application/json
 *          security:
 *              - BearerAuth:
 *                  type: http
 *                  schema: bearer
 *          parameters:
 *              - in: header
 *                name: authorization
 *              - in: path
 *                name: acronym
 *              - in: body
 *                name: acronym
 *                schema:
 *                    type: object
 *                    required:
 *                      - acronym
 *                      - desc
 *                    properties:
 *                          acronym:
 *                               type: string
 *                          desc:
 *                               type: array
 *                               items:
 *                                  type: string
 *          responses:
 *              200:
 *                  description: acronym definitions are updated
 */
router.put("/:acronym", (req, res)=> {
    let body = req.body
    let token = req.headers['x-access-token'] || req.headers['authorization'] || ""
    
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length).trimLeft();
    }
    
    console.log(token)

    try{
        let decoded = jwt.decode(token, SUPER_SECRET);
        console.log(decoded); //=> { foo: 'bar' }    
    }
    catch(err) {
        res.sendStatus(UNAUTHORIZED)
        return 
    }
    
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
// 
/**
 * @swagger
 * /v1/acronym/{acronym}:
 *      delete:
 *          tags:
 *              - acronym
 *          summary: Deletes an acrony in the database, It uses an authorization header to ensure acronyms are protected
 *          produces:
 *              - application/json
 *          consumes:
 *              - application/json
 *          security:
 *              - BearerAuth:
 *                  type: http
 *                  schema: bearer
 *          parameters:
 *              - in: header
 *                name: authorization
 *              - in: path
 *                name: acronym
 *          responses:
 *              200:
 *                  description: acronym es deleted
 */
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