import { Schema, model } from 'mongoose';
import { IGuildConfig } from '../../interfaces';

var guildObject = {
    id: { type: String, unique: true },
    spotify: {
        archive: Boolean,
        archiveChannel: String,
        expiry: Number,
    },
};
var guildSchema = new Schema(guildObject);
var GuildConfig = model<IGuildConfig>('GuildConfig', guildSchema);

export default GuildConfig;

export async function setArchive(
    id: string,
    channelId: string,
    archive: boolean = true,
    expiry: number = 3600) {
    return GuildConfig.updateOne(
        { id },
        {
            id,
            spotify: {
                archive,
                archiveChannel: channelId,
                expiry,
            }
        },
        { upsert: true, setDefaultsOnInsert: true }
    );
};

export async function getArchive(id: string) {
    let spotifyConfig = (await GuildConfig.findOne({ id }))?.spotify;
    return spotifyConfig.archive ? spotifyConfig.archiveChannel : null
}

export async function getArchiveConfig(id: string) {
    return GuildConfig.findOne({ id });
}