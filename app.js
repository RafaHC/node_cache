//MODULOS
const express = require('express');
const redis = require('redis');
const app = express();

//CRIANDO A CONEXAO COM REDIS
const redisClient = redis.createClient();

//PEGANDO O VALOR DA KEY COM REDIS
const getCache = (key) => {
    return new Promise((resolve, reject) => {
        redisClient.get(key, (err, value) => {
            if (err) reject(err);
            resolve(value);
        })
    })
}

//ARMAZENANDO O VALOR COM REDIS
const setCache = (key, value) => {
    return new Promise((resolve, reject) => {
        redisClient.set(key, value, 'EX', 10, (err, value) => {
            if (err) reject(err);
            resolve(true);
        })
    })
}

//SIMULANDO O GET DE UM BD
const dbFind = (id) => {
    const time = parseInt(Math.random() * 2000);
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(`ID_DB=${id} TIME==${time}`), time)
    })
}

//ROUTE
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
