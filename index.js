const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors')

app.use(cors())


morgan.token('body', (request, response) =>{
return JSON.stringify(request.body)
});

morgan.format('combined',
 ":method :url :status :res[content-length] - :response-time ms :body");


app.use(morgan('tiny', {
    skip: (request, response) => {
        return request.method === 'POST';
    }
}));

app.use(morgan('combined', {skip: (request, response) => request.method !== 'POST'}));

app.use(express.json());

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
  ];

  app.get('/info', (request, response) => {
    response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
`);
  });
  
  app.get('/api/persons', (request, response) => {
    response.json(persons)
  });

  
  app.post('/api/persons', (request, response) => {
    const addPerson= request.body
  
    if (!addPerson.name) {
      return response.status(400).json({ 
        error: 'name missing' 
      })
    };
    
    if(!addPerson.number) {
      return response.status(400).json({ 
        error: 'number missing' 
      })
    };
    
    
    const person = {
      name: addPerson.name,
      number: addPerson.number,
      id: Math.floor(Math.random() * 99999999)
    };

    const matchingName = persons.find(p =>
      p.name.toUpperCase() === addPerson.name.toUpperCase());
    if(matchingName !== undefined) {
      return response.status(400).json({ 
        error: 'name must be unique'  
      })
    };
    persons = persons.concat(person)
  
    response.json(person)
  });

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  });
  
  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  });
  // checking if HTTP requests are working by using Postman

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`App runing on port ${PORT}`);
});