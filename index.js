const { response, request } = require('express')
const express = require('express')
const morgan = require("morgan")
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(morgan("tiny"))
app.use(morgan(":method"))
app.use(express.static('build'))

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-642376"
    }
]

let count = persons.length
let date = new Date()

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${count} people</p> <br/> ${date}`)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if(person) {
        response.json(person)
    } else {
        response.status(400).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(p => p.id))
        : 0
    return Math.round(Math.random() * ((maxId), 100) + maxId)

}

app.post('/api/persons', (request, response) => {
    
    const body = request.body

    persons.forEach(per => {
        if(per.name === body.name) {
            return response.status(400).json({
                error: 'name must be unique for every user'
            })
        }
    
        if(per.number === body.number) {
            return response.status(400).json({
                error: 'number must be unique for every user'
            })
        }
    
        if(!body.name){
            return response.status(400).json({
                error: 'name is missing'
            })
        }
    
        if(!body.number){
            return response.status(400).json({
                error: 'number is missing'
            })
        }
    });
    
    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    persons = persons.concat(person)
    response.json(person)

})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server is running on port ${PORT}`);