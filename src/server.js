// const express = require('express');
// const app = express();
// const cors = require('cors');
// const port = 3000;

// app.use(express.json());
// app.use(cors());
// app.use(express.static('public'));


// const users = [
//     {id: 1, name: 'John',age: 25},
//     {id: 2, name: 'Mary',age: 30},
//     {id: 3, name: 'Tom',age: 28},
//     {id: 4, name: 'Jane',age: 32},
//     {id: 5, name: 'Simbat',age:18}
// ];


// app.get('/users', (req, res) => {
//     if(users.length > 0){
//         res.status(200).json({message: 'Users found', data: users});
//     }else{
//         res.status(404).json({message: 'No users found',data: []});
//     }
// });

// app.listen(port, () => {
//     console.log(`Server listening on port ${port}`);
// });

const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;

app.use(express.json());
app.use(cors());

const logger = (req, res, next) => {
    console.log(`[${new Date().toLocaleString()}]Request made to ${req.url}, use ${req.method} method`);
    next();
};


app.use(logger);

const allMerchandises = [
    { id: 1, name: 'Shirt', price: 25 },
    { id: 2, name: 'Pant', price: 30 },
    { id: 3, name: 'Slipper', price: 28 },
    { id: 4, name: 'Shoes', price: 32 },
    { id: 5, name: 'Bag', price: 18 },
    { id: 6, name: 'Watch', price: 150 },
    { id: 7, name: 'Phone', price: 1000 },
    { id: 8, name: 'Laptop', price: 10000 },
    { id: 9, name: 'Headphone', price: 500 }
];

const users = [
    { id: 1, name: 'John', age: 25, address: "123 Main St" },
    { id: 2, name: 'Mary', age: 30, address: "456 Oak Ave" },
    { id: 3, name: 'Tom', age: 28, address: "789 Pine St" },
    { id: 4, name: 'Jane', age: 32, address: "1011 Maple St" },
    { id: 5, name: 'Simbat', age: 18, address: "1213 Elm St" }
];

const orders = [
    { id: 1, user_id: 1, merchandise_id: 1, quantity: 2 },
    { id: 2, user_id: 2, merchandise_id: 2, quantity: 1 },
    { id: 3, user_id: 3, merchandise_id: 3, quantity: 3 },
    { id: 4, user_id: 4, merchandise_id: 4, quantity: 4 },
    { id: 5, user_id: 5, merchandise_id: 5, quantity: 1 }
];

app.get('/merchandises', (req, res) => {
    if (allMerchandises.length > 0) {
        res.status(200).json({ message: 'Merchandises found', data: allMerchandises });
    } else {
        res.status(404).json({ message: 'No merchandises found', data: [] });
    }
});

app.get('/users', (req, res) => {
    if (users.length > 0) {
        res.status(200).json({ message: 'Users found', data: users });
    } else {
        res.status(404).json({ message: 'No users found', data: [] });
    }
});

app.get('/orders', (req, res) => {
    if (orders.length > 0) {
        res.status(200).json({ message: 'Orders found', data: orders });
    } else {
        res.status(404).json({ message: 'No orders found', data: [] });
    }
});

app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    const user = users.find((user) => user.id === parseInt(id));
    if (user) {
        res.status(200).json({ message: 'User found', data: user });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

app.get('/orders/:id', (req, res) => {
    const { id } = req.params;
    const order = orders.find((order) => order.id === parseInt(id));
    if (order) {
        res.status(200).json({ message: 'Order found', data: order });
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
});

app.get('/merchandises/:id', (req, res) => {
    const { id } = req.params;
    const merchandise = allMerchandises.find((merchandise) => merchandise.id === parseInt(id));
    if (merchandise) {
        res.status(200).json({ message: 'Merchandise found', data: merchandise });
    } else {
        res.status(404).json({ message: 'Merchandise not found' });
    }
});

app.post('/orders', (req, res) => {
    const { user_id, merchandise_id, quantity } = req.body;
    const newOrder = { id: orders.length + 1, user_id, merchandise_id, quantity };
    orders.push(newOrder);
    res.status(201).json({ message: 'Order created successfully', data: newOrder });
});

app.post('/users', (req, res) => {
    const { name, age, address } = req.body;
    const newUser = { id: users.length + 1, name, age, address };
    users.push(newUser);
    res.status(201).json({ message: 'User created successfully', data: newUser });
});

app.post('/merchandises', (req, res) => {
    const { name, price } = req.body;
    const newMerchandise = { id: allMerchandises.length + 1, name, price };
    allMerchandises.push(newMerchandise);
    res.status(201).json({ message: 'Merchandise created successfully', data: newMerchandise });
});

app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, age, address } = req.body;
    const userIndex = users.findIndex((user) => user.id === parseInt(id));
    if (userIndex === -1) {
        res.status(404).json({ message: 'User not found' });
    } else {
        const oldUser = users[userIndex];
        for (let key in oldUser) {
            if (key in req.body) {
                oldUser[key] = req.body[key];
            }
        }
        users[userIndex] = oldUser;
        res.status(200).json({ message: 'User updated successfully', data: oldUser });
    }
});

app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const userIndex = users.findIndex((user) => user.id === parseInt(id));
    if (userIndex === -1) {
        res.status(404).json({ message: 'User not found' });
    } else {
        const deletedUser = users.splice(userIndex, 1)[0];
        res.status(200).json({ message: 'User deleted successfully', data: deletedUser });
    }
});

app.put('/orders/:id', (req, res) => {
    const { id } = req.params;
    const { user_id, merchandise_id, quantity } = req.body;
    const orderIndex = orders.findIndex((order) => order.id === parseInt(id));
    if (orderIndex === -1) {
        res.status(404).json({ message: 'Order not found' });
    } else {
        const oldOrder = orders[orderIndex];
        for (let key in oldOrder) {
            if (key in req.body) {
                oldOrder[key] = req.body[key];
            }
        }
        orders[orderIndex] = oldOrder;
        res.status(200).json({ message: 'Order updated successfully', data: oldOrder });
    }
});

app.delete('/orders/:id', (req, res) => {
    const { id } = req.params;
    const orderIndex = orders.findIndex((order) => order.id === parseInt(id));
    if (orderIndex === -1) {
        res.status(404).json({ message: 'Order not found' });
    } else {
        const deletedOrder = orders.splice(orderIndex, 1)[0];
        res.status(200).json({ message: 'Order deleted successfully', data: deletedOrder });
    }
});

app.put('/merchandises/:id', (req, res) => {
    const { id } = req.params;
    const { name, price } = req.body;
    const merchandiseIndex = allMerchandises.findIndex((merchandise) => merchandise.id === parseInt(id));
    if (merchandiseIndex === -1) {
        res.status(404).json({ message: 'Merchandise not found' });
    } else {
        const oldMerchandise = allMerchandises[merchandiseIndex];
        for (let key in oldMerchandise) {
            if (key in req.body) {
                oldMerchandise[key] = req.body[key];
            }
        }
        allMerchandises[merchandiseIndex] = oldMerchandise;
        res.status(200).json({ message: 'Merchandise updated successfully', data: oldMerchandise });
    }
});

app.delete('/merchandises/:id', (req, res) => {
    const { id } = req.params;
    const merchandiseIndex = allMerchandises.findIndex((merchandise) => merchandise.id === parseInt(id));
    if (merchandiseIndex === -1) {
        res.status(404).json({ message: 'Merchandise not found' });
    } else {
        const deletedMerchandise = allMerchandises.splice(merchandiseIndex, 1)[0];
        res.status(200).json({ message: 'Merchandise deleted successfully', data: deletedMerchandise });
    }
});

app.get('/all-orders/check', (req, res) => {
    const allInfo = [];
    for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        const user = users.find((user) => user.id === order.user_id);
        const merchandise = allMerchandises.find((merchandise) => merchandise.id === order.merchandise_id);
        const info = {
            id: order.id,
            user_name: user.name,
            user_age: user.age,
            user_address: user.address,
            merchandise_name: merchandise.name,
            merchandise_price: merchandise.price,
            quantity: order.quantity
        };
        allInfo.push(info);
    }
    res.status(200).json({ message: 'All orders found', data: allInfo });
});

app.get('/all-orders/check/:id', (req, res) => {
    const {id} = req.params;
    const order = orders.find((order) => order.id === parseInt(id));
    if (order) {
        const user = users.find((user) => user.id === order.user_id);
        const merchandise = allMerchandises.find((merchandise) => merchandise.id === order.merchandise_id);
        const info = {
            id: order.id,
            user_name: user.name,
            user_age: user.age,
            user_address: user.address,
            merchandise_name: merchandise.name,
            merchandise_price: merchandise.price,
            quantity: order.quantity
        };
        res.status(200).json({ message: 'Order found', data: info });
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});