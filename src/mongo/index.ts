import * as mongoose from 'mongoose';
import config from './config';

mongoose.connect(config.url, { useNewUrlParser: true });

export var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connected to MongoDB Server")
});

export default mongoose;