import fastify from 'fastify';
import { env } from './env';
import type { FastifyCookieOptions } from '@fastify/cookie';
import cookie from '@fastify/cookie';
import { transactionRoutes } from './routes/transactions';

const app = fastify();

app.register(cookie, {
	secret: 'my-secret',
	parseOptions: {
		domain: 'localhost',
		maxAge: 604800000,
		path: '/',
		httpOnly: true,
		secure: true,
	},
} as FastifyCookieOptions);

app.register(transactionRoutes, {
	prefix: 'transactions',
});

app
	.listen({
		port: 3333,
	})
	.then(() => {
		console.log("'HTTP Server Running!'");
	});
