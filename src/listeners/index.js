var flags = require('./flags');

module.exports = {
    passthrough: function (msg) {
        for (key in flags) {
            if (msg.content.includes(key)) {
                flags[key].listen(msg);
            }
        }
    }
}