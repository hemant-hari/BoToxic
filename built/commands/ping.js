module.exports = {
    name: 'ping',
    description: 'Pong!',
    execute: function (msg, args) {
        msg.channel.send('pong');
    },
};
