import fastify from 'fastify';
import crypto from 'node:crypto';
import { knex } from './database';
import { env } from './env';
import 'dotenv/config';
import { transactionRoutes } from './routes/transactions';

const app = fastify();
app.register(transactionRoutes);

app
	.listen({
		port: env.PORT,
	})
	.then(() => {
		console.log("'HTTP Server Running!'");
	});
