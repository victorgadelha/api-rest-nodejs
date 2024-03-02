import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { knex } from '../database';
import { randomUUID } from 'node:crypto';
import { checkSessionIdExists } from '../middlewares/check-session-id-exists';

export async function transactionRoutes(app: FastifyInstance) {
	app.get(
		'/',
		{ preHandler: [checkSessionIdExists] },
		async (request, reply) => {
			const { sessionId } = request.cookies;
			const transactions = await knex('transactions')
				.where({ session_id: sessionId })
				.select();

			return { transactions };
		}
	);

	app.get('/:id', { preHandler: [checkSessionIdExists] }, async (request) => {
		const getTrsansactionParamsSchema = z.object({
			id: z.string().uuid(),
		});

		const { id } = getTrsansactionParamsSchema.parse(request.params);

		const transaction = await knex('transactions')
			.where({ id, session_id: id })
			.first();

		return { transaction };
	});

	app.get('/summary', { preHandler: [checkSessionIdExists] }, async () => {
		const summary = await knex('transactions')
			.sum('amount', { as: 'amount' })
			.first();

		return { summary };
	});

	app.post(
		'/',
		{ preHandler: [checkSessionIdExists] },
		async (request, reply) => {
			const createTransactionBodySchema = z.object({
				title: z.string(),
				amount: z.number(),
				type: z.enum(['credit', 'debit']),
			});

			const { title, amount, type } = createTransactionBodySchema.parse(
				request.body
			);

			await knex('transactions').insert({
				id: crypto.randomUUID(),
				title,
				amount: type === 'credit' ? amount : amount * -1,
			});

			return reply.status(201).send();
		}
	);
}
