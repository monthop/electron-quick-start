
var mmSc = () => {

const fs = require('fs')
const { Reader } = require('@dogrocker/thaismartcardreader')
const path = require('path')

var dir = './data';
try {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
} catch (err) {
  console.error(err)
}

const moment = require('moment');

const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:4000');

ws.on('open', function open() {
  ws.send('something');
});

ws.on('message', function incoming(message) {
  console.log('received: %s', message);
});

var ws_send = function(obj) {
  try {
    if(ws.readyState === 1) {
      ws.send(JSON.stringify(obj))
    }    
  } catch (e) {
    console.log('error ',e);
    ws.send(JSON.stringify({e}))
  }     
}

const myReader = new Reader()

process.on('unhandledRejection', (reason) => {
    console.log('From Global Rejection -> Reason: ' + reason);
    ws_send({'unhandledRejection':reason})
});

console.log('Waiting For Device !')
myReader.on('device-activated', async (event) => {
  console.log('Device-Activated')
  console.log(event.name)
  console.log('=============================================')
  ws_send({'device-activated':event.name})
})

myReader.on('error', async (err) => {
  console.log('sc error : ')
  console.log(err)
  ws_send({'error':err})
})

myReader.on('image-reading', (percent) => {
  console.log(percent)
  ws_send({'image-reading': percent})
})

myReader.on('card-inserted', async (person) => {

  const dt = moment().format();
  console.log(dt);
  ws_send({'card-inserted':true})

  const cid = await person.getCid()
  const thName = await person.getNameTH()
  const enName = await person.getNameEN()
  const dob = await person.getDoB()
  const issueDate = await person.getIssueDate()
  const expireDate = await person.getExpireDate()
  const address = await person.getAddress()
  const issuer = await person.getIssuer()

  console.log(`CitizenID: ${cid}`)
  console.log(`THName: ${thName.prefix} ${thName.firstname} ${thName.lastname}`)
  console.log(`ENName: ${enName.prefix} ${enName.firstname} ${enName.lastname}`)
  console.log(`DOB: ${dob.day}/${dob.month}/${dob.year}`)
  console.log(`Address: ${address}`)
  console.log(`IssueDate: ${issueDate.day}/${issueDate.month}/${issueDate.year}`)
  console.log(`Issuer: ${issuer}`)
  console.log(`ExpireDate: ${expireDate.day}/${expireDate.month}/${expireDate.year}`)

  try {
    ws_send({dt,cid,thName,enName,dob,issueDate,expireDate,address,issuer})
  } catch (e) {
    console.log('sc error ',e);
    ws_send({e})
  }    

  console.log('=============================================')
  console.log('Receiving Image')
  const photo = await person.getPhoto()
  console.log(`Image Saved to ${path.resolve('')}/data/${cid}.bmp`)
  console.log('=============================================')
  const photoBuff = Buffer.from(photo)
  const fileStream = fs.createWriteStream(`data/${cid}.bmp`)
  fileStream.write(photoBuff)
  fileStream.close()

  try {
    ws_send({photoBuff})
  } catch (e) {
    console.log('sc error ',e);
    ws_send({e})
  }  
})

myReader.on('device-deactivated', () => { 
  console.log('device-deactivated')
  ws_send({'device-deactivated': true})
})

}

module.exports = mmSc