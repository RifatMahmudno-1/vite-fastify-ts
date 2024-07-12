import Fastify from 'fastify'
import fastifyEnv from '@fastify/env'
import setupVite from './utils/setupVite.js'

const fastify = Fastify()
await fastify.register(fastifyEnv, { dotenv: { path: '../.env' }, schema: { type: 'object' } })

// will handle all get requests
await setupVite(fastify)

await fastify.ready()
if (process.env.Serverless !== 'YES') {
	if (!process.env.PORT) throw Error('PORT not specified')
	await fastify.listen({ port: Number(process.env.PORT) })
	if (process.argv.includes('--dev')) console.log(`Server is running on http://localhost:${process.env.PORT}`)
	else console.log('Server started')
}
export default fastify
