const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

function methonAndCallMV(req, res, next) {
    console.log(`[${new Date().toLocaleDateString()}]\tmethon:${req.method}\tpath:${req.path}\n*************`);
    next();
}

function routerLost(req, res, next) {
    res.status(404).json({ message: 'Сіз берген бағыт жоқ!' });
    next();
}

app.use(methonAndCallMV);

const cities = [
    { id: 1, name: 'Astana', country: 'Kazakhstan', description: 'Қазақстанің астанасы', price: 80 },
    { id: 2, name: 'Almaty', country: 'Kazakhstan', description: 'Қазақстанің ескі астанасы', price: 30 },
    { id: 3, name: 'Shymkent', country: 'Kazakhstan', description: 'Қазақстанің ескі қазақтіл сөйлейтын қаланің бірі', price: 30 },
    { id: 4, name: 'BeiJing', country: 'China', description: '中国的首都', price: 340 },
    { id: 5, name: 'ShangHai', country: 'China', description: '中国经济及口岸特区', price: 360 },
    { id: 6, name: 'XinJiang', country: 'China', description: '中国的口岸及珍贵资源开采区', price: 240 },
    { id: 7, name: 'Tokyo', country: 'Japan', description: '東京は日本の首都であり、経済、文化、政治の中心地です。多くの観光地や美術館、ショッピングスポットが集まっています', price: 650 },
    { id: 8, name: 'Kyoto', country: 'Japan', description: '京都は伝統文化と歴史が息づく都市で、多くの神社、寺院、庭園があり、四季折々の美しさを楽しめます', price: 630 },
    { id: 9, name: 'Osaka', country: 'Japan', description: '大阪は食文化で有名な活気ある都市で、「天下の台所」とも呼ばれています。商業の中心地としても知られています', price: 680 },
    { id: 10, name: 'New York', country: 'USA', description: 'A global metropolis known for its iconic skyline, cultural diversity, and landmarks like Times Square, Central Park, and the Statue of Liberty', price: 1000 },
    { id: 11, name: 'San Francisco', country: 'USA', description: 'Famous for its hilly landscape, Golden Gate Bridge, and vibrant tech scene; it’s a hub of innovation and creativity', price: 980 },
    { id: 12, name: 'Chicago', country: 'USA', description: 'Known for its stunning architecture, deep-dish pizza, and rich jazz and blues heritage, located by Lake Michigan', price: 1080 }
];

app.get('/api/destinations', (req, res) => {
    const querys = req.query;
    if (querys.name) {
        const filteredCities = cities.filter(city => city.name.toLowerCase().includes(querys.name.toLowerCase()));
        if (filteredCities.length > 0)
            return res.json(filteredCities);
        else
            return res.status(400).json({ message: 'Сіз берген ақпарат жоқ!' });
    } else {
        if (querys.country) {
            const filteredCities = cities.filter(city => city.country.toLowerCase().includes(querys.country.toLowerCase()));
            if (filteredCities.length > 0)
                return res.json(filteredCities);
            else
                return res.status(404).json({ message: 'Сіз берген ақпарат жоқ!' });
        }
        if(querys.price){
            const filteredCities = cities.filter(city => city.price <= parseInt(querys.price));
            if (filteredCities.length > 0)
                return res.json(filteredCities);
            else
                return res.status(400).json({ message: 'Сіз берген ақпарат жоқ!' });
        }
    }
    return res.json(cities);
});

app.get('/api/destinations/:id', (req, res) => {
    const id = req.params.id;
    const city = cities.find(city => city.id == id);
    if (city) {
        return res.json(city);
    } else {
        return res.status(404).json({ message: 'Сіз берген ақпарат жоқ!' });
    }
});

app.post('/api/destinations', (req, res) => {
    let newCity = req.body;
    if (newCity && Object.keys(newCity).length == (Object.keys(cities[0]).length - 1)) {
        for (let key in newCity) {
            if (newCity[key] === null || newCity[key] === undefined) {
                return res.status(400).json({ message: `Field ${key} is required` });
            }
            else {
                if (key === 'id') {
                    return res.status(400).json({ message: `Field ${key} is not allowed` });
                }
            }
        }
    }
    else {
        newCity = req.query;
        if (Object.keys(newCity).length > 0 && Object.keys(newCity).length == (Object.keys(cities[0]).length - 1)) {
            for (let key in newCity) {
                if (newCity[key] === null || newCity[key] === undefined) {
                    return res.status(400).json({ message: `Field ${key} is required` });
                }
                else {
                    if (key === 'id') {
                        return res.status(400).json({ message: `Field ${key} is not allowed` });
                    }
                }
            }
        }
        else {
            return res.status(400).json({ message: 'Сіз берген ақпарат толық емес!' });
        }
    }

    const newData = {
        id: cities[cities.length - 1].id + 1,
        name: newCity.name,
        country: newCity.country,
        description: newCity.description,
        price: parseInt(newCity.price)
    }
    cities.push(newData);
    return res.json(newData);
});

app.put('/api/destinations/:id', (req, res) => {
    const id = req.params.id;
    const city = cities.find(city => city.id == id);
    if (city) {
        const updatedCity = req.body;
        if (updatedCity) {
            for (let key in updatedCity) {
                if (updatedCity[key] === null || updatedCity[key] === undefined) {
                    return res.status(400).json({ message: `Field ${key} is required` });
                }
                else {
                    if (key === 'id') {
                        return res.status(400).json({ message: `Field ${key} is not allowed` });
                    }
                }
                const index = cities.indexOf(city);
                cities[index] = updatedCity;
                return res.json(updatedCity);
            }
        }
        else {
            const updatedCity = req.query;
            if (Object.keys(updatedCity).length > 0) {
                for (let key in updatedCity) {
                    if (updatedCity[key] === null || updatedCity[key] === undefined) {
                        return res.status(400).json({ message: `Field ${key} is required` });
                    }
                    else {
                        if (key === 'id') {
                            return res.status(400).json({ message: `Field ${key} is not allowed` });
                        }
                    }
                    const index = cities.indexOf(city);
                    const update = {... city};
                    console.log(update);
                    for(let key in updatedCity){
                        update[key]=updatedCity[key];
                    }
                    update.price=parseInt(update.price);
                    console.log(update);
                    cities[index] = update;
                    return res.json({ message: 'Ақпараты өзгертілді!', updated: update , old: city });
                }
            }
        }
    } else {
        return res.status(400).json({ message: 'Сіз берген ақпарат жоқ!' });
    }
});

app.delete('/api/destinations/:id', (req, res) => {
    const id = req.params.id;
    const index = cities.findIndex(city => city.id == id);
    const oldCity = cities[index];
    if (index !== -1) {
        cities.splice(index, 1);
        return res.json({ message: 'Ақпараты өшірілді!', deleted: oldCity });
    } else {
        return res.status(404).json({ message: 'Сіз берген ақпарат жоқ!' });
    }
});

app.use(routerLost);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}\n http://localhost:${PORT}`);
});