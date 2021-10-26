const express = require('express')
const app = express()
app.use(express.json())
const path = require('path')

const Rollbar = require('rollbar')

let rollbar = new Rollbar({
    accessToken:'a6840d238870491ba2dccc01654cf548',
    captureUncaught: true,
    captureUnhandledRejections: true
})


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
    rollbar.info('html file served successfully')
})

app.get('/',function(req,res) {
    res.sendFile(path.join(__dirname, '/tictac.js'));
  });
  

let items = []

app.post('/api/student', (req, res) => {
    let {name} = req.body
    

    const index = items.findIndex(studentName => studentName === name)

    if(index === -1 && name!= ''){

    items.push(name)
    rollbar.log('Item Added successfully', {
        author: 'John', type: 'manual entry'
    })
    res.status(200).send(items)
} else if(name === '') {
    rollbar.error('No item entered')
    res.status(400).send('Must add a new item.')
} else {
    rollbar.critical('Item already on a list')
    res.status(400).send('Item already on a list')
}
})

app.get('/style', (req,res) =>{
    res.sendFile(path.join(__dirname, '/public/styles.css'))
}
)
app.use(rollbar.errorHandler())

const port = process.env.PORT || 4545

app.listen(port, () => console.log(`Take us to warp ${port}`))