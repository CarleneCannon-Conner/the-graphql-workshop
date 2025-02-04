import t from 'tap'
import fastify from 'fastify'
import mercurius from 'mercurius'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { typeDefs, resolvers } from '../graphql.js'

const buildServer = async () => {
  const server = fastify({
    logger: false
  })

  server.register(mercurius, {
    schema: makeExecutableSchema({ typeDefs, resolvers })
  })

  await server.ready()

  return server
}

t.test('should return sum of two numbers', async t => {
  const server = await buildServer()

  const query = `query { add(x: 3, y:5) }`

  const response = await server.inject({
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    url: '/graphql',
    payload: JSON.stringify({ query })
  })

  t.equal(response.statusCode, 200)

  const { data, errors } = await response.json()

  t.equal(errors, undefined)
  t.strictSame(data, {
    add: 8
  })
})
