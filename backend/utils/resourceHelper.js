const searchResources = require("./tavilySearch")

const getResources = async (query, isVideoRequest = false) => {

    const options = {};

    if (isVideoRequest) {
        options.includeDomains = ["youtube.com"];
        options.maxResults = 3;
    } else {
        options.maxResults = 3;
    }

    const results = await searchResources(query, options)

    console.log("Results:", results);
    console.log(Array.isArray(results));

    return results.map(item => ({
        title: item.title,
        url: item.url
    }))
}

module.exports = getResources