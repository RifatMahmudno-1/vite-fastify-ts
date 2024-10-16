import { FastifyInstance } from 'fastify'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const clientDir = join(dirname(fileURLToPath(import.meta.url)), '../../../client')

export default async (fastify: FastifyInstance) => {
	if (process.argv.includes('--dev')) {
		const { createServer } = await import('vite')

		const vite = await createServer({
			configFile: join(clientDir, './vite.config.ts'),
			server: {
				middlewareMode: true
			}
		})

		fastify.get('*', (req, res) => vite.middlewares(req.raw, res.raw))
	} else {
		if (process.env.Serverless !== 'YES') {
			// not serverless, actual server
			// headers are needed for cache

			const { default: fastifyStatic } = await import('@fastify/static')

			await fastify.register(fastifyStatic, {
				root: join(clientDir, './build'),
				cacheControl: false,
				wildcard: false,
				setHeaders(opts, path, __) {
					const bn = basename(path)
					if (bn && bn.match(/.*-.{8}\.[a-zA-Z0-9]+$/)?.[0] === bn) opts.setHeader('cache-control', 'public, max-age=31536000, immutable')
					else opts.setHeader('cache-control', 'public, max-age=120, must-revalidate')
				}
			})

			fastify.get('*', (_, res) => res.sendFile('index.html'))
		} else {
			// serverless
			// headers not needed here cause static files aren't served from here

			const { readFileSync } = await import('node:fs')
			const indexFile = readFileSync(join(clientDir, './build/index.html'))

			fastify.get('*', (_, res) => res.type('text/html').send(indexFile))
		}
	}
}
