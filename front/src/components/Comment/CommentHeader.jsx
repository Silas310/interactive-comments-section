import { formatTimeAgo } from '../../utils/formatTimeAgo';

function CommentHeader({ profileImage, username, time, isOwner }) {
  const formattedTime = formatTimeAgo(time);

  return (
    <div className="flex items-center gap-2">
      <img
        src={profileImage}
        alt="profile"
        className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover"
      />
      <h2 className="text-grey-800 font-bold">
        {username}{' '}
        {isOwner && ( // name + if its the current user, show "you" badge
          <span className="text-white bg-purple-600 py-[0.1rem] px-1 font-normal">
            you
          </span>
        )}
      </h2>
      <span className="text-grey-500">{formattedTime}</span>
    </div>
  );
}

export default CommentHeader;
