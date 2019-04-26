const express = require('express');

const app = express();

const cache = {};

const dbFind = (id) => {
    const time = parseInt(Math.random() * 2000);
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(`ID_DB=${id} TIME==${time}`), time)
    })
}

app.get('/', (req, res) => res.send('caching things'));

app.get('/get/:id',async (req, res) => {
    const id = req.params.id;
    const now = new Date().getTime();
    
    if(cache[id] && cache[id].time + 10000 > now) 
    {
        res.send(`id retornado from cache: `+ JSON.stringify(cache[id]))
    }
    else
    {
        const idValue = await dbFind(id);
        cache[id] = {
            time: new Date().getTime(),
            'value': idValue
        };
        res.send(`id retornado from db: `+ JSON.stringify(cache[id]))
    }
})
app.listen(3000, () => console.log('servidor on!'))

//https://www.youtube.com/watch?v=Jw2EfdstyLA&t=48s