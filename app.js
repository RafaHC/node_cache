const express = require('express');

const app = express();
const redis = require('redis');
const redisClient = redis.createClient();


const getCache = (key) => {
    return new Promise((resolve, reject) => {
        redisClient.get(key, (err, value) => {
            if (err) reject(err);
            resolve(value);
        })
    })
}

const setCache = (key, value) => {
    return new Promise((resolve, reject) => {
        redisClient.set(key, value, 'EX', 10, (err, value) => {
            if (err) reject(err);
            resolve(true);
        })
    })
}

const dbFind = (id) => {
    const time = parseInt(Math.random() * 2000);
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(`ID_DB=${id} TIME==${time}`), time)
    })
}

app.get('/', (req, res) => res.send('caching things'));

app.get('/get/:id',async (req, res) => {
    const id = req.params.id;

    const value = await getCache(`get${id}`);
    if(value){
        res.send(`id retornado from cache: ` + JSON.stringify(value))      
    }else{
        const idValue = await dbFind(id);
        await setCache(`get${id}`, idValue);
        res.send(`id retornado from db: ` + idValue)
    }
})
app.listen(3000, () => console.log('servidor on!'))

//https://www.youtube.com/watch?v=Jw2EfdstyLA&t=48s