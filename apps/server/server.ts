import Fastify from 'fastify';

import { server as serverConfig } from './config';
import { graphqlPlugin } from './plugins';

const startServer = async () => {
  const server = Fastify({ logger: serverConfig.enableLogger });

  await server.register(graphqlPlugin);

  await server.ready();

  server.listen({ port: 8000 }, () => {
    server.log.info('Server started!');
  });
};

startServer();
