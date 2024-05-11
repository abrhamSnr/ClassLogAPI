const mongoose = require('mongoose');
const { ServerApiVersion } = require('mongodb');

const app = require('./app');

require('dotenv').config();

const port = process.env.PORT || 8080;

(async () => {
  try {
    const uriDB = process.env.MONGODB_CONNECTION_STRING.replace(
      '<password>',
      process.env.MONGODB_PWD
    );
    await mongoose.connect(uriDB, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
      }
    });
    console.log('Connected to MongoDB Atlas');
  } catch (err) {
    console.error('Error connecting to MongoDB: ', err.message);
  }
})();

app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
