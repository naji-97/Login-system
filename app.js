var flash = require('connect-flash')
const express = require('express')
const session = require('express-session')
var expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport =  require('passport')
const app = express()

// Passport config
require('./config/passport')(passport)

require('dotenv').config()

// connect Mongoose
mongoose.connect(process.env.DB_URI)
.then(()=>{
console.log("Mongoose Connetc");
}).catch(err=>console.log(err))

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Express-session
app.use(session({
    secret: 'secrut',
    resave: true,
    saveUninitialized: true,
  }))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//   Connect flash
app.use(flash())

// Global Vars 
app.use((req,res, next)=>{
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})
// Routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

const PORT = process.env.PORT

app.listen(PORT, console.log(
`App runnig on port ${PORT}`
))