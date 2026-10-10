const urlParams = new URLSearchParams(window.location.search);
const version = urlParams.get("version");

function getATags(root = document) {
    const results = [];
    results.push(...root.querySelectorAll("a"));

    const all = root.querySelectorAll("*");
    for (const e of all) {
        if (e.shadowRoot) {
            results.push(...getATags(e.shadowRoot));
        }
    }

    return results;
}

if (version) {
    setTimeout(() => {
        getATags().forEach(e => {
            try {
                const url = new URL(e.href, window.location.origin);
                
                if (url.origin === window.location.origin) {
                    url.searchParams.set("version", version);
                    e.href = url.toString();
                }
            } catch (e) {
                // ignore hrefs like #, javascript:void(0)
            }
        });
    }, 200);
}