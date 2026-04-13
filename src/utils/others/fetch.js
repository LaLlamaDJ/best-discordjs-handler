const cache = new Map();

async function apifetch(url, options = {}) {
    const {
        method = "GET",
        headers = {},
        body,
        timeout = 5000,
        retries = 2,
        useCache = false
    } = options;

    if (useCache && cache.has(url)) {
        return cache.get(url);
    }

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const res = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                ...headers
            },
            body: body ? JSON.stringify(body) : undefined,
            signal: controller.signal
        });
        clearTimeout(id);
        const contentType = res.headers.get("content-type");
        let data;
        if (contentType && contentType.includes("application/json")) {
            data = await res.json();
        } else {
            data = await res.text();
        }

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }
        if (useCache) {
            cache.set(url, data);
        }
        return data;
    } catch (err) {
        clearTimeout(id);
        if (retries > 0) {
            await new Promise(r => setTimeout(r, 500));
            return apifetch(url, { ...options, retries: retries - 1 });
        }
        throw new Error(`Fetch failed: ${err.message}`);
    }
}
apifetch.get = (url, options = {}) =>
    apifetch(url, { ...options, method: "GET" });

apifetch.post = (url, body, options = {}) =>
    apifetch(url, {
        ...options,
        method: "POST",
        body
    });

apifetch.put = (url, body, options = {}) =>
    apifetch(url, {
        ...options,
        method: "PUT",
        body
    });

apifetch.delete = (url, options = {}) =>
    apifetch(url, { ...options, method: "DELETE" });

module.exports = apifetch;