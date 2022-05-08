import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';


declare global {
    var signin: () => Promise<string[]>;
}

// this is the hook which is going to run on startup
let mongo: any;
beforeAll(async () => {
    process.env.JWT_KEY = "asdfasdf";
    process.env.NODE_TLS_REJEDT_UNAUTHORIZED = '0';

    mongo = await MongoMemoryServer.create();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri);
});

// this is the hook which is going to run before all our tests

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections){
        await collection.deleteMany({});
    }
})


// third hood will stop and close connection with monogdb 

afterAll(async ()=>{
    await mongo.stop();
    await mongoose.connection.close();
});

global.signin = async()=>{
    const email = 'test@test.com';
    const password = 'password';

    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email, password
        })
        .expect(201);

        const cookie = response.get('Set-Cookie');
        return cookie;
};