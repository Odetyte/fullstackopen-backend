const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('type passwors as a first argument')
  process.exit(1)
};

 const password = process.argv[2];

const url =
  `mongodb+srv://fullstack:${password}@cluster0.5woud.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number,
});

const Phonebook = mongoose.model('Phonebook', phonebookSchema)

if (process.argv.length === 3) {
    Phonebook.find({}).then(person => {
        console.log("phonebook:");
        person.forEach(newperson => {
            console.log(newperson);
        });
        mongoose.connection.close();
    });
} else if (process.argv.length === 5) {
    const name = process.argv[3];
    const number = process.argv[4];
    
    const newperson = new Phonebook({
        name,
        number
    });
    newperson.save().then(result => {
        console.log(`${name} ${number} was saved to database`);
        mongoose.connection.close();
    });
 } else {
    console.log("Name or number is missing");
     process.exit(1);
};