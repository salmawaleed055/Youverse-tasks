import React, { useState, useEffect, useCallback } from 'react';
import VideoPlayer from './VideoPlayer';
import styled, { keyframes, css } from 'styled-components';
import { Heart, MessageCircle, Share2, SkipForward, Pause, Play } from "lucide-react";

// Animations
const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
`;

const slideUp = keyframes`
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
`;

const pulse = keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
`;

const heartBurst = keyframes`
    0% { transform: scale(0); opacity: 1; }
    100% { transform: scale(1.5); opacity: 0; }
`;

const spin = keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
`;

// ALL Styled Components
const ReelPageContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: #000;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ReelContent = styled.div`
    width: 100%;
    height: 100%;
    max-width: 450px;
    position: relative;
    background: #000;

    @media (max-width: 768px) {
        max-width: 100%;
    }
`;

const VideoWrapper = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
    background: #000;
    border-radius: 0;
    overflow: hidden;
    cursor: pointer;

    @media (min-width: 769px) {
        border-radius: 20px;
    }
`;

const InfoOverlay = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20px;
    background: linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.7) 50%, transparent);
    z-index: 10;
    animation: ${slideUp} 0.5s ease-out;
`;

const CreatorInfo = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    animation: ${fadeIn} 0.6s ease-out;
`;

const CreatorImage = styled.img`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 2px solid #fff;
    margin-right: 12px;
    object-fit: cover;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
`;

const CreatorDetails = styled.div`
    flex: 1;
`;

const CreatorName = styled.h4`
    margin: 0;
    font-weight: 600;
    font-size: 1rem;
    color: #fff;
    text-shadow: 0 1px 3px rgba(0,0,0,0.5);
`;

const CategoryInfo = styled.div`
    display: flex;
    gap: 8px;
    margin-top: 4px;
    flex-wrap: wrap;
`;

const Badge = styled.span`
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 0.75rem;
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.2);
`;

const TranscriptionText = styled.p`
    font-size: 0.95rem;
    line-height: 1.4;
    margin: 12px 0;
    color: #fff;
    text-shadow: 0 1px 3px rgba(0,0,0,0.5);
    animation: ${fadeIn} 0.8s ease-out;
    animation-delay: 0.2s;
    animation-fill-mode: both;
`;

const InteractionPanel = styled.div`
    position: absolute;
    right: 15px;
    bottom: 80px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    align-items: center;
    z-index: 20;
`;

const InteractionItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    animation: ${fadeIn} 0.5s ease-out;
    animation-delay: ${props => props.delay}s;
    animation-fill-mode: both;
`;

const InteractionButton = styled.button`
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    
    &:active {
        animation: ${pulse} 0.3s ease-out;
    }
    
    &:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(1.1);
    }
    
    ${props => props.liked && css`
        background: rgba(255, 20, 80, 0.2);
        border-color: #ff1450;
        color: #ff1450;
    `}
`;

const HeartBurst = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: radial-gradient(circle, #ff1450, transparent);
    animation: ${heartBurst} 0.6s ease-out;
    pointer-events: none;
`;

const InteractionCount = styled.span`
    font-size: 0.8rem;
    color: #fff;
    font-weight: 500;
    text-shadow: 0 1px 3px rgba(0,0,0,0.5);
`;

const PauseOverlay = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80px;
    height: 80px;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(10px);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    color: white;
    opacity: ${props => props.show ? 1 : 0};
    transform: translate(-50%, -50%) scale(${props => props.show ? 1 : 0.8});
    transition: all 0.3s ease;
    pointer-events: none;
    z-index: 15;
`;

const ErrorOverlay = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: white;
    background: rgba(0, 0, 0, 0.8);
    padding: 20px;
    border-radius: 10px;
    z-index: 15;
`;

const ErrorText = styled.div`
    font-size: 1.2rem;
    margin-bottom: 10px;
`;

const ErrorSubtext = styled.div`
    font-size: 0.9rem;
    opacity: 0.7;
`;

const LoadingOverlay = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    color: white;
    z-index: 15;
`;

const LoadingSpinner = styled.div`
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255, 255, 255, 0.1);
    border-top-color: #fff;
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.div`
    font-size: 0.9rem;
    opacity: 0.8;
`;

const VideoCounter = styled.div`
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 0.8rem;
    backdrop-filter: blur(10px);
`;

// Main Component
const Reel = ({ videoData, transcription, onNext, videoUrl, currentIndex = 0, totalVideos = 1 }) => {
    const [isPlaying, setIsPlaying] = useState(true);
    const [liked, setLiked] = useState(false);
    const [showHeartBurst, setShowHeartBurst] = useState(false);
    const [likes, setLikes] = useState(() => Math.floor(Math.random() * 1000) + 100);
    const [comments] = useState(() => Math.floor(Math.random() * 100) + 10);
    const [shares] = useState(() => Math.floor(Math.random() * 50) + 5);
    const [showPauseIcon, setShowPauseIcon] = useState(false);
    const [videoError, setVideoError] = useState(false);
    const [isVideoReady, setIsVideoReady] = useState(false);

    // Reset states when video changes
    useEffect(() => {
        setIsPlaying(true);
        setShowPauseIcon(false);
        setVideoError(false);
        setIsVideoReady(false);

        // Reset interaction states for new video
        setLiked(false);
        setLikes(Math.floor(Math.random() * 1000) + 100);

        console.log('Video changed, resetting states');
    }, [videoUrl, currentIndex]);

    const handleLike = useCallback(() => {
        setLiked(prev => !prev);
        setLikes(prev => liked ? prev - 1 : prev + 1);

        if (!liked) {
            setShowHeartBurst(true);
            setTimeout(() => setShowHeartBurst(false), 600);
        }
    }, [liked]);

    const handleComment = useCallback(() => {
        console.log('Comment clicked for video:', videoData?.id);
        alert('Comments feature coming soon!');
    }, [videoData?.id]);

    const handleShare = useCallback(async () => {
        const shareData = {
            title: videoData?.title || `${videoData?.creatorName || 'Creator'}'s Educational Reel`,
            text: transcription,
            url: window.location.href,
        };

        try {
            if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
            }
        } catch (err) {
            console.log('Share failed:', err);
            alert('Sharing not available');
        }
    }, [videoData, transcription]);

    const handleVideoClick = useCallback(() => {
        const newPlayingState = !isPlaying;
        setIsPlaying(newPlayingState);
        setShowPauseIcon(true);

        setTimeout(() => setShowPauseIcon(false), 800);

        console.log(`Video ${newPlayingState ? 'resumed' : 'paused'}`);
    }, [isPlaying]);

    const handleVideoReady = useCallback(() => {
        setIsVideoReady(true);
        setVideoError(false);
        console.log('Video is ready to play');
    }, []);

    const handleVideoError = useCallback(() => {
        setVideoError(true);
        console.error('Video failed to load:', videoUrl);

        // Auto-skip to next video after 3 seconds
        setTimeout(() => {
            console.log('Auto-skipping due to video error');
            onNext();
        }, 3000);
    }, [videoUrl, onNext]);

    const handleVideoEnd = useCallback(() => {
        console.log('Video ended, moving to next');
        onNext();
    }, [onNext]);

    // Format numbers (1000 -> 1k, 1000000 -> 1M)
    const formatCount = (count) => {
        if (count >= 1000000) {
            return (count / 1000000).toFixed(1) + 'M';
        }
        if (count >= 1000) {
            return (count / 1000).toFixed(1) + 'k';
        }
        return count.toString();
    };

    // Validate video data
    const safeVideoData = {
        id: videoData?.id || 'unknown',
        title: videoData?.title || 'Educational Video',
        creatorName: videoData?.creatorName || 'Unknown Creator',
        creatorPicture: videoData?.creatorPicture,
        category: videoData?.category || 'Education',
        subcategory: videoData?.subcategory,
        skillLabel: videoData?.skillLabel,
        ...videoData
    };

    const safeTranscription = transcription || "Discover amazing educational content in this video.";

    console.log('Rendering Reel:', {
        videoUrl,
        currentIndex,
        totalVideos,
        isPlaying,
        isVideoReady,
        videoError,
        videoData: safeVideoData
    });

    return (
        <ReelPageContainer>
            <ReelContent>
                <VideoWrapper onClick={handleVideoClick}>
                    <VideoPlayer
                        key={`video-${currentIndex}-${safeVideoData.id}`}
                        url={videoUrl}
                        isPlaying={isPlaying}
                        onNext={handleVideoEnd}
                        muted={true}
                    />

                    <PauseOverlay show={(!isPlaying && isVideoReady) || showPauseIcon}>
                        {isPlaying ? <Pause size={40} /> : <Play size={40} />}
                    </PauseOverlay>

                    {videoError && (
                        <ErrorOverlay>
                            <ErrorText>Video unavailable</ErrorText>
                            <ErrorSubtext>Skipping to next...</ErrorSubtext>
                        </ErrorOverlay>
                    )}

                    {!isVideoReady && !videoError && (
                        <LoadingOverlay>
                            {/*<LoadingSpinner />*/}
                            {/*<LoadingText>Loading...</LoadingText>*/}
                        </LoadingOverlay>
                    )}
                </VideoWrapper>

                <InfoOverlay>
                    <CreatorInfo>
                        <CreatorImage
                            src={safeVideoData.creatorPicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(safeVideoData.creatorName)}&background=5865F2&color=fff&bold=true`}
                            alt={safeVideoData.creatorName}
                            onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(safeVideoData.creatorName)}&background=5865F2&color=fff&bold=true`;
                            }}
                        />
                        <CreatorDetails>
                            <CreatorName>{safeVideoData.creatorName}</CreatorName>
                            <CategoryInfo>
                                <Badge>📚 {safeVideoData.category}</Badge>
                                {safeVideoData.subcategory && <Badge>{safeVideoData.subcategory}</Badge>}
                                {safeVideoData.skillLabel && <Badge>🎯 {safeVideoData.skillLabel}</Badge>}
                            </CategoryInfo>
                        </CreatorDetails>
                    </CreatorInfo>
                    <TranscriptionText>"{safeTranscription}"</TranscriptionText>

                    <VideoCounter>
                        {currentIndex + 1} of {totalVideos}
                    </VideoCounter>
                </InfoOverlay>

                <InteractionPanel>
                    <InteractionItem delay={0.3}>
                        <InteractionButton
                            liked={liked}
                            onClick={handleLike}
                            aria-label="Like video"
                        >
                            {showHeartBurst && <HeartBurst />}
                            <Heart size={26} fill={liked ? "#fff" : "none"} />
                        </InteractionButton>
                        <InteractionCount>{formatCount(likes)}</InteractionCount>
                    </InteractionItem>

                    <InteractionItem delay={0.4}>
                        <InteractionButton
                            onClick={handleComment}
                            aria-label="Comment on video"
                        >
                            <MessageCircle size={26} />
                        </InteractionButton>
                        <InteractionCount>{formatCount(comments)}</InteractionCount>
                    </InteractionItem>

                    <InteractionItem delay={0.5}>
                        <InteractionButton
                            onClick={handleShare}
                            aria-label="Share video"
                        >
                            <Share2 size={26} />
                        </InteractionButton>
                        <InteractionCount>{formatCount(shares)}</InteractionCount>
                    </InteractionItem>

                    <InteractionItem delay={0.6}>
                        <InteractionButton
                            onClick={onNext}
                            aria-label="Next video"
                        >
                            <SkipForward size={26} />
                        </InteractionButton>
                    </InteractionItem>
                </InteractionPanel>
            </ReelContent>
        </ReelPageContainer>
    );
};

export default Reel;