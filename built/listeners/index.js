var flags = require('./flags');
module.exports = {
    passthrough: function (msg) {
        for (var key in flags) {
            if (msg.content.includes(key)) {
                flags[key].listen(msg);
            }
        }
    }
};
