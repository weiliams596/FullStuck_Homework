const express = require('express');
const app = express();
const pool = require('./task2/db');

app.get('/books', async (req, res) => {
    const query = 'SELECT * FROM books';
    try {
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong');
    }
});


app.get('/books/:id',async (req,res)=>{
    const id = req.params.id;
    const query = 'SELECT * FROM books WHERE id = $1';
    try {
        const result = await pool.query(query,[id]);
        if(result.rows.length === 0){
            res.status(404).send('Book not found');
        }else{
            res.json(result.rows[0]);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong');
    }

});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});