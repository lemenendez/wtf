let express = require('express')
let router = express.Router()

let { random } = require('./../database/acronym')

// TODO: Apply DRY principle here(refactor http codes)
const NOT_FOUND = 404

/**
 * @swagger
 * /v1/random/{count}:
 *      get:
 *          tags:
 *              -   acronym
 *          description: returns `:count` random acronyms, the acronyms returned aren't adjacent rows from the data
 *          produces:
 *              - application/json
 *          parameters:
 *              - name: count
 *                description: The number of acronyms
 *                required: true
 *                in: path
 *          responses:
 *              200:
 *                  description: When operation was success, it returns the list of acronyms
 */
router.get("/:count", (req, res) => {
    random(parseInt(req.params.count))
    .then(rows=> {
        if(rows){
            res.json(rows)
        }
        else {
            res.sendStatus(NOT_FOUND)
        }
    })
})

module.exports = router