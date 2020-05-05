import { Document } from 'mongoose';

export interface IUser extends Document {
    id: string,
    username: string,
    spotify: {
        accessToken: string,
        refreshToken: string,
        expiry: number,
    },
};

export interface IGuildConfig extends Document {
    id: string,
    spotify: {
        archive: boolean,
        archiveChannel: string,
        expiry: number,
    },
};

export interface ICommand {
    name: string,
    description: string,
    execute: Function,
}
