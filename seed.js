const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const User = require('./models/user'); // adjust if path different

mongoose.connect('mongodb://127.0.0.1:27017/LibraryDB')
    .then(() => console.log("DB Connected"))
    .catch(err => console.log(err));

async function seedUsers() {
    let users = [];

    for (let i = 0; i < 100; i++) {
        users.push({
            username: faker.internet.username(),  // FIXED
            email: faker.internet.email(),
            role: 'student'
        });
    }

    await User.insertMany(users);
    console.log("100 Fake Students Added!");
    mongoose.connection.close();
}

seedUsers();
