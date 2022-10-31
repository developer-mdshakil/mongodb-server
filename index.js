const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//midleware use to share client site
app.use(cors());
app.use(express.json());


// user: dbuser2
// password: VTkdZHyTOZyMT5Yk

app.get('/', (req, res)=> {
    res.send('Hello my mongoDB crud server running')
})

const uri = "mongodb+srv://dbuser3:rNZl0fVjz7ROATVX@cluster0.io31lql.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run (){
    try{
        const userCollection = client.db('client-user').collection('users');
       
        app.get('/users', async(req, res)=> {
            const query = {};
            const cursor  = userCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/users/:id', async(req, res)=> {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const user = await userCollection.findOne(query);
            res.send(user);
        })

        app.put('/users/:id', async(req, res)=> {
            const id = req.params.id;
            const user = req.body;
            const filter = { _id: ObjectId(id)};
            const options = { upsert: true };
            const updateUser = {
               $set:{
                name: user.name,
                email: user.email,
                address: user.addres,
               }
            }
            const result = await userCollection.updateOne(filter, updateUser, options);
            res.send(result)
        })

        app.post('/users', async(req, res)=> {
            const user = req.body;
            const result = await userCollection.insertOne(user)
            res.send(result);
        })

        app.delete('/users/:id', async(req, res)=> {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await userCollection.deleteOne(query);
            res.send(result)
        })
    }
    finally{

    }
}
run().catch(error => console.log(error))


app.listen(port, ()=> {
    console.log(`mongodb crud server running port ${port}`);
})