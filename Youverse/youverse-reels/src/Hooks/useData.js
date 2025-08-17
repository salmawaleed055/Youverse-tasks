import { useState, useEffect } from 'react';
import axios from 'axios';

// THE FIX IS ON THIS LINE: Changed 'vv3' back to 'v3'
const VIDEO_API = 'https://api.jsonbin.io/v3/b/689b3a9cae596e708fc82c19/latest?meta=false';
const TRANSCRIPTION_API = 'https://api.jsonbin.io/v3/b/689b3ab243b1c97be91c75da/latest?meta=false';

export const useData = () => {
    const [videos, setVideos] = useState([]);
    const [transcriptions, setTranscriptions] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [videoRes, transcriptionRes] = await Promise.all([
                    axios.get(VIDEO_API),
                    axios.get(TRANSCRIPTION_API),
                ]);
                setVideos(videoRes.data);
                setTranscriptions(transcriptionRes.data);
            } catch (err) {
                setError('Failed to fetch data. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { videos, transcriptions, loading, error };
};