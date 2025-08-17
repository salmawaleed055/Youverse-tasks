import React, { useState, useEffect, useCallback } from 'react';
import Reel from './Reel';
import styled, { keyframes } from 'styled-components';
function extractEmbedUrl(url, start, end) {
    const regex = /(?:youtube\.com\/.*v=|youtu\.be\/)([^&]+)/;
    const match = url.match(regex);
    const videoId = match ? match[1] : null;
    if (!videoId) return url;
    return `https://www.youtube.com/embed/${videoId}?start=${start}&end=${end}&autoplay=1&mute=1&controls=0`;
}
// API URLs
const VIDEO_API_URL = 'https://api.jsonbin.io/v3/b/689b3a9cae596e708fc82c19/latest?meta=false';
const TRANSCRIPTION_API_URL = 'https://api.jsonbin.io/v3/b/689b3ab243b1c97be91c75da/latest?meta=false';

/* ================= STYLING ================= */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
`;

const Background = styled.div`
    background: linear-gradient(135deg, #0f0f0f, #1a1a2e, #16213e);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: ${fadeIn} 0.8s ease-in-out;
    color: #fff;
`;

const LoadingScreen = styled(Background)`
    flex-direction: column;
    gap: 25px;
    text-align: center;
`;

const LoadingSpinner = styled.div`
    width: 60px;
    height: 60px;
    border: 4px solid rgba(255, 255, 255, 0.1);
    border-top-color: #00e6ff;
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
    box-shadow: 0 0 15px rgba(0,230,255,0.4);
`;

const ErrorScreen = styled(Background)`
  flex-direction: column;
  color: #ff4c4c;
  text-align: center;
  padding: 20px;
`;

const RetryButton = styled.button`
  padding: 12px 28px;
  margin-top: 15px;
  background: linear-gradient(135deg, #ff0050, #ff3366);
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 1.1rem;
  cursor: pointer;
  font-weight: bold;
  box-shadow: 0 6px 18px rgba(255, 0, 80, 0.35);
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #ff3366, #ff0050);
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 10px 24px rgba(255, 0, 80, 0.55);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 5px 14px rgba(255, 0, 80, 0.35);
  }
`;

/* ================= MAIN COMPONENT ================= */
const ReelsPage = () => {
    const [videos, setVideos] = useState([]);
    const [transcriptions, setTranscriptions] = useState({});
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);

    const [prevIndex, setPrevIndex] = useState(-1); // track previous video

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const [videoRes, transcriptionRes] = await Promise.all([
                fetch(VIDEO_API_URL),
                fetch(TRANSCRIPTION_API_URL),
            ]);

            if (!videoRes.ok || !transcriptionRes.ok) {
                throw new Error('Failed to fetch data from API');
            }

            const videoData = await videoRes.json();
            const transcriptionData = await transcriptionRes.json();

            const videosArray = Array.isArray(videoData) ? videoData : [];

            if (videosArray.length === 0) {
                throw new Error('No videos found in API response');
            }

            const processedVideos = videosArray.map((video, index) => ({
                ...video,
                url: video.url || video.link, // only API-provided links
                id: video.id || `video-${index}`,
                category: video.category || 'General',
                subcategory: video.subcategory || 'Learning',
                skillLabel: video.skillLabel || video.skill || 'Educational',
                creatorName: video.creatorName || video.creator || 'Unknown Creator',
                creatorPicture: video.creatorPicture || video.avatar || '/default-avatar.png'
            }));

            setVideos(processedVideos);
            setTranscriptions(transcriptionData || {});

            if (processedVideos.length > 0) {
                const randomIndex = Math.floor(Math.random() * processedVideos.length);
                setCurrentIndex(randomIndex);
            }

            setLoading(false);
            setRetryCount(0);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleNextReel = useCallback(() => {
        if (videos.length <= 1) return;
        let nextIndex;

        // ensure not same as current or previous
        do {
            nextIndex = Math.floor(Math.random() * videos.length);
        } while (nextIndex === currentIndex || nextIndex === prevIndex);

        setPrevIndex(currentIndex);
        setCurrentIndex(nextIndex);
    }, [videos, currentIndex, prevIndex]);

    const handleRetry = () => {
        setRetryCount(prev => prev + 1);
        fetchData();
    };

    if (loading) {
        return (
            <LoadingScreen>
                <LoadingSpinner />
                <div style={{ fontSize: "1.5rem", fontWeight: "500" }}>Loading Reels...</div>
                {retryCount > 0 && <div style={{ opacity: 0.7 }}>Retry attempt: {retryCount}</div>}
            </LoadingScreen>
        );
    }

    if (error) {
        return (
            <ErrorScreen>
                <h2>⚠️ Failed to load reels</h2>
                <div style={{ fontSize: '1rem', opacity: 0.7 }}>{error}</div>
                <RetryButton onClick={handleRetry}>
                    Retry {retryCount > 0 && `(${retryCount})`}
                </RetryButton>
            </ErrorScreen>
        );
    }

    if (videos.length === 0 || currentIndex === -1) {
        return (
            <ErrorScreen>
                <h2>No videos available</h2>
                <RetryButton onClick={handleRetry}>Refresh</RetryButton>
            </ErrorScreen>
        );
    }

    const currentVideo = videos[currentIndex];
    if (!currentVideo) {
        return (
            <ErrorScreen>
                <h2>Error loading video</h2>
                <RetryButton onClick={handleNextReel}>Skip to Next</RetryButton>
            </ErrorScreen>
        );
    }

    const categoryTranscriptions = transcriptions[currentVideo.category] || [];
    const randomTranscription = categoryTranscriptions.length > 0
        ? categoryTranscriptions[Math.floor(Math.random() * categoryTranscriptions.length)]
        : "Discover amazing educational content in this video.";

    // generate 10-second clip
    const randomStartTime = Math.floor(Math.random() * 50) + 10; // between 10–60s
    const randomEndTime = randomStartTime + 10;
    const videoUrl = `${currentVideo.url}?start=${randomStartTime}&end=${randomEndTime}`;

    return (
        <Reel
            key={`reel-${currentIndex}-${Date.now()}`}
            videoData={currentVideo}
            transcription={randomTranscription}
            videoUrl={videoUrl}
            onNext={handleNextReel}
            currentIndex={currentIndex}
            totalVideos={videos.length}
        />
    );
};

export default ReelsPage;