const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

function methonAndCallMV(req,res,next){
    console.log(`[${new Date().toLocaleDateString()}] \nmethon:${req.method} \npath:${req.path}\n*************`);
    next();
}

app.use(methonAndCallMV);

const cities = [
    { id: 1, name: 'Astana', country: 'Kazahstan', description: 'Қазақстанің астанасы' },
    { id: 2, name: 'Almaty', country: 'Kazahstan', description: 'Қазақстанің ескі астанасы' },
    { id: 3, name: 'Shymkent', country: 'Kazahstan', description: 'Қазақстанің ескі қазақтіл сөйлейтын қаланің бірі' },
    { id: 4, name: 'BeiJing', country: 'China', description: '中国的首都' },
    { id: 5, name: 'ShangHai', country: 'China', description: '中国经济及口岸特区' },
    { id: 6, name: 'XinJiang', country: 'China', description: '中国的口岸及珍贵资源开采区' },
    { id: 7, name: 'Tokyo', country: 'Japan', description: '東京は日本の首都であり、経済、文化、政治の中心地です。多くの観光地や美術館、ショッピングスポットが集まっています' },
    { id: 8, name: 'Kyoto', country: 'Japan', description: '京都は伝統文化と歴史が息づく都市で、多くの神社、寺院、庭園があり、四季折々の美しさを楽しめます' },
    { id: 9, name: 'Osaka', country: 'Japan', description: '大阪は食文化で有名な活気ある都市で、「天下の台所」とも呼ばれています。商業の中心地としても知られています' },
    { id: 10, name: 'New York', country: 'USA', description: 'A global metropolis known for its iconic skyline, cultural diversity, and landmarks like Times Square, Central Park, and the Statue of Liberty' },
    { id: 11, name: 'San Francisco', country: 'USA', description: 'Famous for its hilly landscape, Golden Gate Bridge, and vibrant tech scene; it’s a hub of innovation and creativity' },
    { id: 12, name: 'Chicago', country: 'USA', description: 'Known for its stunning architecture, deep-dish pizza, and rich jazz and blues heritage, located by Lake Michigan' }
];

app.get('/api/destinations', (req, res) => {
    const querys = req.query;
    if (querys.name) {
        const filteredCities = cities.filter(city => city.name.toLowerCase().includes(querys.name.toLowerCase()));
        if (filteredCities.length > 0)
            return res.json(filteredCities);
        else
            return res.status(400).json({ message: 'Барлық ақпарат толтырылмаған!' });
    } else {
        if (querys.country) {
            const filteredCities = cities.filter(city => city.country.toLowerCase().includes(querys.country.toLowerCase()));
            if (filteredCities.length > 0)
                return res.json(filteredCities);
            else
                return res.status(400).json({ message: 'Барлық ақпарат толтырылмаған!' });
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
        return res.status(400).json({ message: 'Барлық ақпарат толтырылмаған!' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}\n http://localhost:${PORT}`);
});