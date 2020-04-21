import * as mongoose from 'mongoose';
import { connect, connection } from 'mongoose';
import config from './config';

connect(config.url, { useNewUrlParser: true });

export var db = connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connected to MongoDB Server")
});

export default mongoose;