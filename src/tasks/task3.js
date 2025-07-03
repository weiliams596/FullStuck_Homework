const express = require('express');
const app = express();
const pool = require('./task2/db');

const PORT = 3000;

app.use(express.json());

const validateUser = (req, res, next) => {
  let userQuery = req.body;
  if(typeof userQuery !== 'object'){
    userQuery = req.query;
  }
  if(userQuery.username === undefined || userQuery.email === undefined){
    return res.status(400).send('Name and email are required');
  }
  if(!userQuery.email.includes('@')){
    return res.status(400).send('Invalid email format');
  }
  if(userQuery.username.length < 3){
    return res.status(400).send('Name should be at least 3 characters long');
  }
  req.userQuery = userQuery;
  next();
};

app.post('/users',validateUser,async(req,res)=>{
  let userQuery = req.userQuery;
  console.log(userQuery);
  let sqlQuery = 'SELECT * FROM users WHERE username=$1 AND email=$2';
  try{
    const result = await pool.query(sqlQuery,[userQuery.username,userQuery.email]);
    if(result.rows.length === 0){
      sqlQuery = 'INSERT INTO users (username,age,city,password,email) VALUES ($1,$2,$3,$4,$5) RETURNING *';
      const insertResult = await pool.query(sqlQuery,[userQuery.username,parseInt(userQuery.age),userQuery.city,userQuery.password,userQuery.email]);
      res.json(insertResult.rows[0]);
    }else{
      res.status(409).send('User already exists');
    }
  }catch(error){
    console.error(error);
    res.status(500).send({message:error.detail.toLocalString()});
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`http://localhost:${PORT}/`);
});