// metadata-parser.js

async function fetchMetadata(url) {
    try {
        const domain = new URL(url).hostname;
        let buttonText = "Open Link";

        if (domain.includes("linkedin.com")) {
            buttonText = "Open in LinkedIn";
        } else if (domain.includes("google.com")) {
            buttonText = "Open in Google Jobs";
        } else if (domain.includes("simplify.jobs")) {
            buttonText = "Open in Simplify";
        }

        return { title: "Fetching Metadata...", description: "", domain, buttonText };
    } catch (error) {
        console.error('Error fetching metadata:', error);
        return { title: 'Unknown Title', description: 'No Description Available', domain: 'Unknown Domain', buttonText: 'Open Link' };
    }
}