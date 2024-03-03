import request from 'supertest';
import { app } from '../src/server';

beforeAll(async () => {
    await app.ready()
})
