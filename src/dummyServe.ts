import express from 'express';

export const createDummyServer = (port: number) => {
  const PORT = port;
  const app = express();
  app.get('/', (_req, res) => {
    res.send('🤖Bot is running!!🤖');
  });

  app.get('/_ah/warmup', (_req, res) => {
    res.sendStatus(200);
  });

  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
};
