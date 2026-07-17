const { tavily } = require("@tavily/core");

const client = tavily({
    apiKey: process.env.TAVILY_API_KEY
});

const searchResources = async (query, options = {}) => {

    try {

        const searchOptions = {
            searchDepth: "advanced",
            maxResults: options.maxResults || 5
        };

        if (options.includeDomains && options.includeDomains.length > 0) {
            searchOptions.includeDomains = options.includeDomains;
        }

        const response = await client.search(query, searchOptions);

        console.log(response);

        return response.results || [];

    } catch (err) {

        console.log(err);

        return [];

    }

};

module.exports = searchResources;