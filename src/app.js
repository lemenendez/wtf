
let express = require('express')
let logger = require('morgan')
let bodyParser = require('body-parser')

let acronymRouter = require('./routes/acronym')

let app = express()


// TODO: logger set to environment variable
//app.use(logger('dev'))
app.use(express.json())

app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/acronym', acronymRouter)
/*
app.use(function (req, res, next) {
    next(createError(404));
})

app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500)
    res.send()
    //res.render('error');
});
*/
module.exports = app