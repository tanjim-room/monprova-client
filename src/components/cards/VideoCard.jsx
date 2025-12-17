
import { Link } from 'react-router-dom';
import Button from '../Button';

const VideoCard = ({ video }) => {

    const { title, description, link, embedLink } = video
    return (
        <div>
            <div className="card bg-base-100 shadow-md border-1 rounded-md overflow-hidden">
                <figure>
                    <iframe className='w-full' width="" height="280" src={embedLink} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                </figure>
               

            </div>
          
        </div>

    );
};

export default VideoCard;

