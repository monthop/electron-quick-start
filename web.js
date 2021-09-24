
var mmWeb = () => {

const express = require('express')
var cors = require('cors')
const app = express()
const port = 3000

console.log('hello express');

/*var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}*/
app.use(cors())

//app.get('/', cors(corsOptions), (req, res) => {
app.get('/', (req, res) => {  
  res.json({ msg: 'Hello World!' });
})

app.get('/sc', (req, res) => {  
  res.json({ msg: 'Hello SC' });
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

return app

}

module.exports = mmWeb