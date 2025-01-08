import { PrismaClient } from '@prisma/client';
import { env } from '../env';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
	globalForPrisma.prisma ||
	new PrismaClient({
		log:
			env.NODE_ENV === 'development'
				? [
						// "query",
						'error',
						'warn',
					]
				: ['error'],
	});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
