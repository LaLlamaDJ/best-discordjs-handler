const mongoose = require("mongoose");
const { prefix } = require("../public/botconfig.json");

const guildSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
        unique: true
    },
    prefix: {
        type: String,
        default: prefix
    },
    timestamps: true
});

module.exports = mongoose.model("Guild", guildSchema);