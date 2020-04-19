module.exports = {
	name: 'link',
	description: 'Links your spotify account to your Discord account with BoToxic',
	async execute(msg, args, api) {
		let scopes = ['user-read-private', 'user-read-email', 'user-modify-playback-state'];
		let state = `${msg.author.id}_${msg.author.username}`;
		let authURL = api.createAuthorizeURL(scopes, state);

		let dmChannel = await msg.author.createDM();
		dmChannel.send("Follow this URL to authorize BoToxic to link to your Spotify!");
		dmChannel.send(authURL);

		msg.channel.send("Sent you a PM!");
	},
};