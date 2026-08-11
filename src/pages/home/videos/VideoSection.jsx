import React from 'react';
import useVideos from '../../../hooks/useVideos';
import VideoCard from '../../../components/cards/VideoCard';
import { Link } from 'react-router-dom';
import Button from '../../../components/Button';


const VideoSection = () => {
    const [videos] = useVideos();
    return (
        <div className='mt-6' id="videos">
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mx-auto px-4'>
                {
                    videos.slice(0, 6).map(video => (
                        <VideoCard key={video.id} video={video} />
                    ))
                }
            </div>
          
        </div>
    );
};

export default VideoSection;
