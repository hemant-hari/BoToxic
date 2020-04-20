module.exports = {
    dict: {
        '⏯️': require('./enqueue'),
        '⏭️': require('./skipto'),
    },
    filter: function (reaction, user) {
        var listen = true;
        if (user.bot) { return false; }
        for (emoji in this.dict) {
            listen = listen && reaction.emoji.name === emoji;
        }
        return listen;
    },
    react: function (msg) {
        for (emoji in this.dict) {
            msg.react(emoji);
        }
    },
    handle: function (reaction, user, api) {
        this.dict[reaction.emoji.name].execute(reaction, user, api);
    }
}