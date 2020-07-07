const express = require('express')
const app = express()

app.use(express.json())

let persons = [
    {
      
      name: "Arto Hellas",
      number: "040-123456",
      id: 1
    },
    {
      
      name: "Ada Lovelace",
      number: "39-44-5323523",
      id: 2
    },
    {
      name: "Dan Abramov",
      number: "12-43-234345",
      id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
      }
  ]

  app.get('/info', (req, res) => {
    res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
`);
  })
  
  app.get('/api/persons', (req, res) => {
    res.json(persons)
  })

  
  app.post('/api/persons', (request, response) => {
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
    
    
    const person = {
      name: addPerson.name,
      number: addPerson.number,
      id: Math.floor(Math.random() * 99999999)
    }
    if(addPerson.name === person.name) {
      return response.status(400).json({ 
        error: 'name must be unique'  
      })
    }
    persons = persons.concat(person)
  
    response.json(person)
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  
  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })
  // checking if HTTP requests are working by using Postman

const port = 3001
app.listen(port)
console.log(`Server running on port ${port}`)