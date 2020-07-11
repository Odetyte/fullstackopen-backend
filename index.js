require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))


morgan.token('body', (request) => {
  return JSON.stringify(request.body)
})

morgan.format('combined',
  ':method :url :status :res[content-length] - :response-time ms :body')


app.use(morgan('tiny', {
  skip: (request) => {
    return request.method === 'POST'
  }
}))

app.use(morgan('combined', { skip: (request) => request.method !== 'POST' }))

app.use(express.json())

let persons = [
  {

    name: 'Arto Hellas',
    number: '040-123456',
    id: 1
  },
  {

    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: 4
  }
]

app.get('/info', (request, response) => {
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
`)
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})


app.post('/api/persons', (request, response, next) => {
  const addPerson= request.body

  if (!addPerson.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  if(!addPerson.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }


  const person =  new Person ({
    name: addPerson.name,
    number: addPerson.number,
    id: Math.floor(Math.random() * 99999999)
  })


  const matchingName = persons.find(p =>
    p.name.toUpperCase() === addPerson.name.toUpperCase())
  if(matchingName !== undefined) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  return person
    .save()
    .then((personToSave) => {
      response.json(personToSave.toJSON())
    })
    .catch((error) => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.deleteOne({ _id: request.params.id }) // good documentation on how to delete on mongoosejs.com
    .then(result => {
      if (result.deletedCount === 0) {
        response.status(404).json({ errorMessage: 'Person no longer exists' })
      } else {
        response.status(204).end()
      }
    })
    .catch((error) => next(error))
})
// checking if HTTP requests are working by using Postman

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  return Person.findOne({ _id: request.params.id }).then((upersonToUpdate) => {
    const person = upersonToUpdate
    person.name = body.name
    person.number = body.number

    person
      .save()
      .then((personToSave) => {
        response.json(personToSave.toJSON())
      })
      .catch((error) => next(error))
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'Malformed ID' })
  }else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`The app is running on port ${PORT}`)
})