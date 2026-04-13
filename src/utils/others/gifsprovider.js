const api = require("./fetch.js");

const providers = [
    {
        name: "waifu.pics",
        build: (type) => `https://api.waifu.pics/sfw/${type}`,
        parse: (data) => data.url
    },
    {
        name: "nekos.life",
        build: (type) => `https://nekos.life/api/v2/img/${type}`,
        parse: (data) => data.url
    },
    {
        name: "nekos.best",
        build: (type) => `https://nekos.best/api/v2/${type}`,
        parse: (data) => data.results?.[0]?.url
    }];

const history = new Map();
function shuffle(arr) {
    return arr.sort(() => 0.5 - Math.random());
}   

function isRepeated(type, gif) {
    const list = history.get(type) || [];
    return list.includes(gif);
}

function saveGif(type, gif) {
    const list = history.get(type) || [];
    list.push(gif);
    if (list.length > 20) list.shift();
    history.set(type, list);
}

async function getGif(type) {
    const shuffled = shuffle([...providers]);
    for (const p of shuffled) {
        try {
            const url = p.build(type);
            const data = await api(url, { timeout: 4000 });
            const gif = p.parse(data);
            if (!gif) continue;
            if (isRepeated(type, gif)) continue;
            saveGif(type, gif);
            return gif;
        } catch (err) {}
    }
    throw new Error(`No se encontró un GIF válido para: ${type}`);
}

const dgif = new Proxy({}, {
    get(_, prop) {
        return () => getGif(prop.toString());
    }
});

module.exports = dgif;