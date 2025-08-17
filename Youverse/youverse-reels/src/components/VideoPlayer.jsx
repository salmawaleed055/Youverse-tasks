import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

// Advanced animations
const spin = keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
`;

const pulse = keyframes`
    0% { transform: scale(1); opacity: 0.7; }
    50% { transform: scale(1.1); opacity: 1; }
    100% { transform: scale(1); opacity: 0.7; }
`;

const shimmer = keyframes`
    0% { background-position: -200px 0; }
    100% { background-position: calc(200px + 100%) 0; }
`;

const bounce = keyframes`
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
`;

const glow = keyframes`
    0% { box-shadow: 0 0 5px rgba(74, 144, 226, 0.5); }
    50% { box-shadow: 0 0 20px rgba(74, 144, 226, 0.8), 0 0 30px rgba(74, 144, 226, 0.6); }
    100% { box-shadow: 0 0 5px rgba(74, 144, 226, 0.5); }
`;

const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
`;

const VideoContainer = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
    }
`;

const VideoIframe = styled.iframe`
    width: 100%;
    height: 100%;
    border: none;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 20px;
    transition: opacity 0.5s ease;
    opacity: ${props => props.loaded ? 1 : 0};
`;

const LoadingContainer = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    z-index: 10;
    color: white;
    text-align: center;
    animation: ${fadeIn} 0.5s ease-out;
`;

const LoadingSpinner = styled.div`
    width: 60px;
    height: 60px;
    border: 4px solid rgba(255, 255, 255, 0.2);
    border-top: 4px solid #4a90e2;
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
    position: relative;

    &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 20px;
        height: 20px;
        background: #4a90e2;
        border-radius: 50%;
        animation: ${pulse} 1.5s ease-in-out infinite;
    }
`;

const LoadingText = styled.div`
    font-size: 1.2rem;
    font-weight: 600;
    background: linear-gradient(45deg, #4a90e2, #7b68ee, #50c878);
    background-size: 200% 200%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: ${shimmer} 2s ease-in-out infinite;
`;

const LoadingSubtext = styled.div`
    font-size: 0.9rem;
    opacity: 0.8;
    animation: ${bounce} 2s ease-in-out infinite;
`;

const ProgressBar = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    width: 100%;
    z-index: 5;
    backdrop-filter: blur(10px);
    overflow: hidden;
`;

const ProgressFill = styled.div`
    height: 100%;
    background: linear-gradient(90deg,
    #ff6b6b 0%,
    #4ecdc4 25%,
    #45b7d1 50%,
    #f9ca24 75%,
    #6c5ce7 100%
    );
    background-size: 200% 100%;
    width: ${props => props.progress}%;
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    border-radius: 3px;
    animation: ${props => props.animate ? 'shimmer 3s linear infinite' : 'none'};

    &::after {
        content: '';
        position: absolute;
        top: -2px;
        right: -2px;
        bottom: -2px;
        width: 4px;
        background: white;
        border-radius: 2px;
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
        opacity: ${props => props.progress < 100 ? 1 : 0};
        transition: opacity 0.3s ease;
    }
`;

const LearningBadge = styled.div`
    position: absolute;
    top: 15px;
    left: 15px;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%);
    color: white;
    padding: 8px 16px;
    border-radius: 25px;
    font-size: 0.85rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    animation: ${glow} 3s ease-in-out infinite;
    z-index: 10;
    transition: all 0.3s ease;
    
    &::before {
        content: '🧠';
        font-size: 1rem;
    }
    
    &:hover {
        transform: scale(1.05);
        cursor: pointer;
    }
`;

const SkipButton = styled.button`
    position: absolute;
    bottom: 20px;
    right: 20px;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
    backdrop-filter: blur(10px);
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 8px;
    
    &:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: translateY(-2px);
    }
    
    &::after {
        content: '→';
    }
`;

const VideoPlayer = ({ url, isPlaying, onNext, muted }) => {
    const [embedUrl, setEmbedUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [loadingStage, setLoadingStage] = useState(0);
    const [iframeLoaded, setIframeLoaded] = useState(false);
    const timerRef = useRef(null);
    const progressTimerRef = useRef(null);
    const loadingIntervalRef = useRef(null);

    const loadingMessages = [
        { text: "🔍 Finding the perfect learning content...", sub: "Curating knowledge just for you" },
        { text: "🎯 Optimizing for your learning style...", sub: "Personalizing the experience" },
        { text: "🚀 Almost ready to expand your mind!", sub: "Get ready to learn something amazing" }
    ];

    useEffect(() => {
        // Cycle through loading messages
        loadingIntervalRef.current = setInterval(() => {
            setLoadingStage(prev => (prev + 1) % loadingMessages.length);
        }, 2000);

        const extractVideoId = (videoUrl) => {
            if (!videoUrl) return null;

            const patterns = [
                /(?:youtube\.com\/watch\?v=|youtube\.com\/v\/|youtube\.com\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
                /(?:youtube\.com\/watch\?.*&v=|youtube\.com\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
                /(?:youtube\.com\/watch\?.*v=|youtube\.com\/v\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/
            ];

            for (const pattern of patterns) {
                const match = videoUrl.match(pattern);
                if (match) return match[1];
            }
            return null;
        };

        const videoId = extractVideoId(url);

        if (!videoId) {
            console.error("Invalid YouTube URL");
            setEmbedUrl('');
            setLoading(false);
            return;
        }

        const timeMatch = url.match(/(?:t=|#t=)(\d+)/);
        const startTime = timeMatch ? parseInt(timeMatch[1]) : Math.floor(Math.random() * 60) + 10;
        const endTime = startTime + 10;

        const newEmbedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&mute=${muted ? 1 : 0}&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&fs=0&disablekb=1&start=${startTime}&end=${endTime}&enablejsapi=1&origin=${window.location.origin}`;

        setEmbedUrl(newEmbedUrl);
        setLoading(true);
        setProgress(0);
        setIframeLoaded(false);

        // Clear previous timers
        if (timerRef.current) clearTimeout(timerRef.current);
        if (progressTimerRef.current) clearInterval(progressTimerRef.current);

        // Set up new timers
        timerRef.current = setTimeout(() => {
            onNext();
        }, 12000);

        let progressValue = 0;
        progressTimerRef.current = setInterval(() => {
            progressValue += 100 / 120; // 120 steps for 12 seconds
            setProgress(Math.min(progressValue, 100));
            if (progressValue >= 100) {
                clearInterval(progressTimerRef.current);
            }
        }, 100);

        return () => {
            clearInterval(loadingIntervalRef.current);
        };
    }, [url, isPlaying, muted, onNext]);

    const handleIframeLoad = () => {
        setIframeLoaded(true);
        setTimeout(() => {
            setLoading(false);
        }, 500); // Short delay for smooth transition
    };

    const handleSkip = () => {
        onNext();
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            if (progressTimerRef.current) clearInterval(progressTimerRef.current);
            if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
        };
    }, []);

    return (
        <VideoContainer>
            {loading && (
                <LoadingContainer>
                    <LoadingSpinner />
                    <LoadingText>
                        {loadingMessages[loadingStage].text}
                    </LoadingText>
                    <LoadingSubtext>
                        {loadingMessages[loadingStage].sub}
                    </LoadingSubtext>
                </LoadingContainer>
            )}

            {embedUrl && (
                <VideoIframe
                    src={embedUrl}
                    title="Educational Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onLoad={handleIframeLoad}
                    loaded={iframeLoaded}
                />
            )}

            {/*<LearningBadge>*/}
            {/*    Interactive Learning*/}
            {/*</LearningBadge>*/}

            <ProgressBar>
                <ProgressFill progress={progress} animate={progress < 100} />
            </ProgressBar>

            <SkipButton onClick={handleSkip}>
                Skip
            </SkipButton>
        </VideoContainer>
    );
};

export default VideoPlayer;