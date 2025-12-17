import React from 'react';
import useVideos from '../../../hooks/useVideos';
import VideoCard from '../../../components/cards/VideoCard';
import { Link } from 'react-router-dom';
import Button from '../../../components/Button';

const VideoSection = () => {
    const [videos] = useVideos();
    return (
        <div>
            <div className='grid grid-cols-3 gap-8 mx-auto px-24'>
                {
                    videos.slice(0, 6).map(video => (
                        <VideoCard key={video.id} video={video} />
                    ))
                }
            </div>
            <div className="flex justify-center text-center my-12">
                <Link to="/doctorList">
                    <Button btnName={"সব ভিডিও দেখুন"} bgColor={"bg-secondary-color"}></Button>
                </Link>
            </div>
        </div>
    );
};

export default VideoSection;
