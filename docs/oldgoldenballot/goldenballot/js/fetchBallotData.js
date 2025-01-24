/**
 * Fetches and parses the ballot JSON file, returning categories with matching property names
 * that are used in the rest of your code (e.g., 'work_code' and 'pictureTitle').
 */
export async function fetchBallotData() {
    try {
        const response = await fetch("ballson-gg.json");
        if (!response.ok) throw new Error("Failed to load ballot data");

        const rawData = await response.json();

        // Group nominations by category
        const groupedData = rawData.reduce((categories, item) => {
            if (!categories[item.category]) {
                categories[item.category] = {
                    title: item.category,
                    nominations: [],
                };
            }

            categories[item.category].nominations.push({
                // Match exactly how you're referencing them in renderBallot.js
                work_code: item["work_code"],            // for data-id
                pictureTitle: item["work_title"],        // used in <span>${nomination.pictureTitle}</span>
                nomineeName: item["nominee_name"],       // if you ever need it
                trailerLink: item["trailer-link"],       // if you ever need it
                // Add or remove fields as you see fit
            });

            return categories;
        }, {});

        // Convert grouped data object into an array
        return Object.values(groupedData);
    } catch (error) {
        console.error("Error loading ballot data:", error.message);
        return [];
    }
}