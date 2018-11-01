const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))


app.use('/', require('./postarticle'))
app.use('/comment', require('./models/comment'))
app.use('/profile', require('./models/profile'))
app.use('/',require('./getuser'))
app.listen(3939, () => {
      console.log('Server started http://localhost:3939')
    })
 
  