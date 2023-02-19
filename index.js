const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.userDB}:${process.env.pass}@cluster0.ermhfxw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const postCollection = client.db('postHub').collection('posts');
        const userCollection = client.db('postHub').collection('user');
        const commentCollection = client.db('postHub').collection('comments');

        app.get('/posts', async (req, res) => {
            const query = {};
            const cursor = postCollection.find(query);
            const post = await cursor.toArray();
            res.send(post);
        })

        app.get('/posts/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: new ObjectId(id) };
            const service = await postCollection.findOne(query);
            res.send(service);
        });

        app.get('/userProfile', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const user = await cursor.toArray();
            res.send(user);
        })

        app.get('/topPosts', async (req, res) => {
            const query = {};
            const cursor = postCollection.find(query);
            const post = await cursor.limit(3).toArray();
            res.send(post);
        });

        app.post('/posts', async (req, res) => {
            const userPost = req.body;
            console.log(userPost);
            result = await postCollection.insertOne(userPost);
            res.send(result);
        })

        app.post('/userProfile', async (req, res) => {
            const user = req.body;
            console.log(user);
            result = await userCollection.insertOne(user);
            res.send(result);
        })
        

        app.get('/userProfile/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: new ObjectId(id) };
            const user = await userCollection.findOne(query);
            res.send(user);
        });

        app.put('/userProfile/:id', async(req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const user = req.body
            const option = {upsert: true};;
            const updatedUser = {
                $set:{
                    name: user.name,
                    address: user.address,
                    university: user.university
                }    
            }
            const result = await userCollection.updateOne(filter, updatedUser, option);
            res.send(result);
        })

        app.get('/comments', async (req, res) => {
            const query = {};
            const cursor = commentCollection.find(query);
            const userComment = await cursor.toArray();
            res.send(userComment);
        })


        app.post('/comments', async (req, res) => {
            const userComments = req.body;
            console.log(userComments);
            result = await commentCollection.insertOne(userComments);
            res.send(result);
        })



    }
    finally {

    }
}

run().catch(err => console.log(err))



app.get('/', (req, res) => {
    res.send('PostHub server Running');
})

app.listen(port, () => {
    console.log(`Port is running on ${port}`)
})