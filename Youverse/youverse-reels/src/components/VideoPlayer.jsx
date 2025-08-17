import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';


// Advanced animations
const spin = keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
`;

const pulse = keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
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

const VideoContainer = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
`;

const VideoIframe = styled.iframe`
    width: 100%;
    height: 100%;
    border: none;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 20px;
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
    background: rgba(255, 255, 255, 0.2);
    width: 100%;
    z-index: 5;
    backdrop-filter: blur(10px);
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
    width: ${props => props.progress}%;
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    border-radius: 3px;
    
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
    }
`;

const LearningBadge = styled.div`
    position: absolute;
    top: 15px;
    left: 15px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
    
    &::before {
        content: '🧠';
        font-size: 1rem;
    }
`;

const VideoPlayer = ({ url, isPlaying, onNext, muted }) => {
    const [embedUrl, setEmbedUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [loadingStage, setLoadingStage] = useState(0);
    const timerRef = useRef(null);
    const progressTimerRef = useRef(null);

    const loadingMessages = [
        { text: "🔍 Finding the perfect learning content...", sub: "Curating knowledge just for you" },
        { text: "🎯 Optimizing for your learning style...", sub: "Personalizing the experience" },
        { text: "🚀 Almost ready to expand your mind!", sub: "Get ready to learn something amazing" }
    ];

    useEffect(() => {
        // Cycle through loading messages
        const messageInterval = setInterval(() => {
            setLoadingStage(prev => (prev + 1) % loadingMessages.length);
        }, 2000);

        const extractVideoId = (videoUrl) => {
            const patterns = [
                /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
                /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
                /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
            ];

            for (const pattern of patterns) {
                const match = videoUrl.match(pattern);
                if (match) return match[1];
            }
            return null;
        };

        const videoId = extractVideoId(url);

        if (!videoId) {
            setEmbedUrl('https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&start=10&end=20');
            return () => clearInterval(messageInterval);
        }

        const timeMatch = url.match(/#t=(\d+)/);
        const startTime = timeMatch ? parseInt(timeMatch[1]) : Math.floor(Math.random() * 60) + 10;
        const endTime = startTime + 10;

        const newEmbedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&fs=0&disablekb=1&start=${startTime}&end=${endTime}&enablejsapi=1&origin=${window.location.origin}`;

        setEmbedUrl(newEmbedUrl);
        setLoading(true);
        setProgress(0);

        if (timerRef.current) clearTimeout(timerRef.current);
        if (progressTimerRef.current) clearInterval(progressTimerRef.current);

        timerRef.current = setTimeout(() => {
            onNext();
        }, 12000);

        let progressValue = 0;
        progressTimerRef.current = setInterval(() => {
            progressValue += 1;
            setProgress(progressValue);
            if (progressValue >= 100) {
                clearInterval(progressTimerRef.current);
            }
        }, 100);

        return () => {
            clearInterval(messageInterval);
        };
    }, [url, onNext]);

    const handleIframeLoad = () => {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            if (progressTimerRef.current) clearInterval(progressTimerRef.current);
        };
    }, []);

    return (
        <VideoContainer>
            {/*{loading && (*/}
            {/*    <LoadingContainer>*/}
            {/*        <LoadingSpinner />*/}
            {/*        <LoadingText>*/}
            {/*            {loadingMessages[loadingStage].text}*/}
            {/*        </LoadingText>*/}
            {/*        <LoadingSubtext>*/}
            {/*            {loadingMessages[loadingStage].sub}*/}
            {/*        </LoadingSubtext>*/}
            {/*    </LoadingContainer>*/}
            {/*)}*/}

            {embedUrl && (
                <VideoIframe
                    src={embedUrl}
                    title="Educational Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onLoad={handleIframeLoad}
                />
            )}

            <ProgressBar>
                <ProgressFill progress={progress} />
            </ProgressBar>
        </VideoContainer>
    );
};

export default VideoPlayer;