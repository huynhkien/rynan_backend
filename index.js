const app = require('./app');
const config = require('./src/config/config');
const db = require('./src/config/connectMongoDB');
const PORT = config.app.port;
// run server
db.connect();
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));