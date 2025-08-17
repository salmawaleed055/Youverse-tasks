// Simulated API calls for reels and transcripts
export const fetchReelsData = async () => {
    // Use YouTube video IDs instead of .mp4 files
    return [
        { id: 1, title: "Reel 1", videoId: "dQw4w9WgXcQ", category: "fun" },  // Example
        { id: 2, title: "Reel 2", videoId: "9bZkp7q19f0", category: "tech" }, // Example
        { id: 3, title: "Reel 3", videoId: "3JZ_D3ELwOQ", category: "music" }, // Example
    ];
};

export const fetchTranscriptsData = async () => {
    return [
        {
            category: "fun",
            transcriptions: ["😂 This is hilarious!", "Best reel ever!"],
        },
        {
            category: "tech",
            transcriptions: ["New AI breakthrough 🚀", "Tech trends 2025"],
        },
        {
            category: "music",
            transcriptions: ["🎶 Love this beat!", "Great song choice!"],
        },
    ];
};
