const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./task2/db');


app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Welcome to Task 2');
});

app.get('/api/users', async (req, res) => {
    let query = 'SELECT * FROM users';
    let userQuery = req.query;
    if (Object.keys(userQuery).length === 0) {
        userQuery = req.body;
    }
    let whereQuery = 'WHERE ';
    let datas;
    try {
        for (let key in userQuery) {
            if (!key.toLowerCase().includes('sort'))
                whereQuery += `${key} like '%${userQuery[key]}%' AND `;
            console.log(whereQuery);
        }
        whereQuery = whereQuery.slice(0, -5);
        query += ` ${whereQuery}`;
        if (userQuery.sort) {
            query += ` ORDER BY ${userQuery.sort}`;
        }
        const result = await pool.query(query);
        datas = result.rows;
        console.log(query);
        res.json(datas);
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/users/search', async (req, res) => {
    const searchQuery = req.query;
    let query = 'SELECT * FROM users WHERE ';
    let whereQuery = '';
    for (let key in searchQuery) {
        whereQuery += `${key} like '%${searchQuery[key]}%' AND `;
    }
    whereQuery = whereQuery.slice(0, -5);
    query += whereQuery;
    try {
        const result = await pool.query(query);
        const datas = result.rows;
        console.log(query);
        res.json(datas);
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    let query = `SELECT * FROM users WHERE id = ${id}`;
    try {
        const result = await pool.query(query);
        const data = result.rows[0];
        console.log(query);
        res.json(data);
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/api/register', async (req, res) => {
    let newUser = req.body;
    if (Object.keys(newUser).length === 0) {
        newUser = req.query;
    }
    for (let key in newUser) {
        if (!newUser[key]) {
            return res.status(400).send(`Please provide ${key} in request body`);
        }
    }
    try {
        const result = await pool.query('INSERT INTO users(username,password,age,city) VALUES ($1,$2,$3,$4)',
            [newUser.username, newUser.password, newUser.age, newUser.city]);
        console.log(result);
        res.status(201).send({ message: 'User created successfully', user: result.rows[0] });

    } catch (err) {
        console.log(err);
        res.status(500).send({ message: err.message, error: err.detail });
    }
});

app.post('/api/login', async (req, res) => {
    let user = req.body;
    if (Object.keys(user).length === 0) {
        user = req.query;
    }
    for (let key in user) {
        if (!user[key]) {
            return res.status(400).send(`Please provide ${key} in request body`);
        }
    }
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [user.username, user.password]);
        const data = result.rows[0];
        if (data) {
            res.json({ message: 'Login successful', user: data });
        } else {
            res.status(401).send({ message: 'Invalid username or password' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: err.message, error: err.detail });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}\n http://localhost:${PORT}`);
});
