process.env.NODE_ENV = 'test'

let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../server')
let should = chai.should()

chai.use(chaiHttp)

describe('Acronym', () => {
    describe('/GET Search', () => {
        it('it should GET acronyms that match 10', (done) => {
            chai.request(server)
                .get('/v1/acronym?search=10&limit=20')
                .end((err, res) => {
                    res.should.have.status(200)
                    // console.log(res)
                    done()
                })
        })
    })

    describe('/GET Search', () => {
        it('it should GET acronyms that match 10 and should have more pages', (done) => {
            chai.request(server)
                .get('/v1/acronym?search=10&limit=1')
                .end((err, res) => {
                    res.should.have.status(200)
                    console.log('headers:')
                    res.headers.should.have.property('more-data')
                    // console.log(res.headers)
                    done()
                })
        })
    })

    describe('/GET Acronym', () => {
        it('it should GET an acronym including its definitions', (done) => {
            chai.request(server)
                .get('/v1/acronym/420')
                .end((err, res) => {
                    res.should.have.status(200)
                    done()
                })
        })
    })

    describe('/POST Acronym', () => {
        it('it should create a new acyronym', (done) => {
            let acronym = {
                "acronym": "ZZZZZ",
                "desc": [
                    "Zorro Zorro Zorro"
                ]
            }
            chai.request(server)
                .post('/v1/acronym')
                .send(acronym)
                .end((err, res) => {
                    res.should.have.status(200)
                    done()
                })
        })
    })

    describe('/PUT Acronym', () => {
        it('it should update a acyronym', (done) => {
            let acronym = {
                "acronym": "ZZZZZ",
                "desc": [
                    "Sleeeping, borring"
                ]
            }
            chai.request(server)
                .put('/v1/acronym/ZZZZZ')
                .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NSIsIm5hbWUiOiJKb2huIERvZSIsImlhdCI6MTUxNjIzOTAyMn0.0flS6CW7wKowP05D5aTQTIAAc0GnNjwr7o5JEVgqwto')
                .send(acronym)
                .end((err, res) => {
                    res.should.have.status(200)
                    done()
                })
        })
    })

    describe('/PUT Acronym', () => {
        it('it should FAIL to UPDATE (PUT) a acyronym due to unauthorized', (done) => {
            let acronym = {
                "acronym": "ZZZZZ",
                "desc": [
                    "Sleeeping, borring"
                ]
            }
            chai.request(server)
                .put('/v1/acronym/ZZZZZ')
                .set('Authorization', 'Bearer 3.eyJzdWIiOiIxMjM0NSIsIm5hbWUiOiJKb2huIERvZSIsImlhdCI6MTUxNjIzOTAyMn0.0flS6CW7wKowP05D5aTQTIAAc0GnNjwr7o5JEVgqwto')
                .send(acronym)
                .end((err, res) => {
                    res.should.have.status(401)
                    done()
                })
        })
    })

    describe('/PUT Acronym', () => {
        it('it should FAIL to UPDATE (PUT) a acyronym due to missing authorization header', (done) => {
            let acronym = {
                "acronym": "ZZZZZ",
                "desc": [
                    "Sleeeping, borring"
                ]
            }
            chai.request(server)
                .put('/v1/acronym/ZZZZZ')
                .send(acronym)
                .end((err, res) => {
                    res.should.have.status(401)
                    done()
                })
        })
    })

    describe('/DELETE Acronym', () => {
        it('it should DELETE a acyronym', (done) => {
            chai.request(server)
                .delete('/v1/acronym/ZZZZZ')
                .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NSIsIm5hbWUiOiJKb2huIERvZSIsImlhdCI6MTUxNjIzOTAyMn0.0flS6CW7wKowP05D5aTQTIAAc0GnNjwr7o5JEVgqwto')
                .end((err, res) => {
                    res.should.have.status(200)
                    done()
                })
        })
    })

    describe('/DELETE Acronym', () => {
        it('it should FAIL to DELETE a acyronym due to unauthorized', (done) => {
            chai.request(server)
                .delete('/v1/acronym/ZZZZZ')
                .set('Authorization', 'Bearer eyJzdWIiOiIxMjM0NSIsIm5hbWUiOiJKb2huIERvZSIsImlhdCI6MTUxNjIzOTAyMn0.0flS6CW7wKowP05D5aTQTIAAc0GnNjwr7o5JEVgqwto')
                .end((err, res) => {
                    res.should.have.status(401)
                    done()
                })
        })
    })

    describe('/DELETE Acronym', () => {
        it('it should FAIL to DELETE a acyronym due to missing Authorization header', (done) => {
            chai.request(server)
                .delete('/v1/acronym/ZZZZZ')
                .end((err, res) => {
                    res.should.have.status(401)
                    done()
                })
        })
    })
    
})