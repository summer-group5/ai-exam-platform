const app = require('./app');

// initDb();
// waitForDb();

app.listen(port, async () => {
  console.log(`Backend listening on port ${port}`);
  await initDb();
});