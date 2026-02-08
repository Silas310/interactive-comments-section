import React, { useState } from 'react';
import CommentArea from './CommentArea';

function Comment({
  profileImage,
  username,
  comment,
  time,
  likes,
  replies,
  currentUser,
  commentId,
  mutate,
}) {
  const [likeCount, setLikeCount] = useState(likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const repliedUser = { username }; // To pass to CommentArea if replying

  const handleLike = () => {
    if (!hasLiked) {
      setLikeCount(likeCount + 1);
      setHasLiked(true);
    }
  };

  const handleDislike = () => {
    if (hasLiked) {
      setLikeCount(likeCount - 1);
      setHasLiked(false);
    }
  };

  const handleIsReplying = () => {
    setIsReplying(!isReplying);
  };

  const handleDelete = () => {
    fetch(`/api/comments/${commentId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          console.log('Comment deleted successfully');
          mutate(); // Refresh the comments list after deletion
        } else {
          console.error('Failed to delete comment');
        }
      })
      .catch((error) => {
        console.error('Error deleting comment: ', error);
      });
  };

  return (
    <section className="flex flex-col gap-4 md:gap-6">
      <div className="flex flex-col md:flex-row md:items-start gap-4 bg-white p-4 rounded-md relative">
        <div className="hidden md:flex flex-col items-center gap-2 bg-grey-50 px-2 py-1.5 rounded-xl mr-4 self-start">
          <button className="cursor-pointer p-2 group" onClick={handleLike}>
            <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg">
              <path
                className={`${hasLiked ? 'fill-purple-600' : 'fill-[#C5C6EF]'} group-hover:fill-purple-600`}
                d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 
                .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 
                0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 
                0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 
                .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z"
                fill="#C5C6EF"
              />
            </svg>
          </button>
          <span className="text-purple-600 font-bold">{likeCount}</span>
          <button className="cursor-pointer p-2 group" onClick={handleDislike}>
            <svg width="11" height="3" xmlns="http://www.w3.org/2000/svg">
              <path
                className="group-hover:fill-purple-600"
                d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 
                0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 
                .53.167h8.495Z"
                fill="#C5C6EF"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img
                src={profileImage}
                alt="profile"
                className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover"
              />
              <h2 className="text-grey-800 font-bold">
                {username}{' '}
                {username === currentUser?.username && ( // name + if its the current user, show "you" badge
                  <span className="text-white bg-purple-600 py-[0.1rem] px-1 font-normal">
                    you
                  </span>
                )}
              </h2>
              <span className="text-grey-500">{time}</span>
            </div>

            {currentUser?.username === username ? ( // del / edit buttons only for the comment owner
              <div className="hidden md:flex items-center gap-4 font-bold cursor-pointer">
                <button
                  className="flex items-center gap-2 cursor-pointer hover:opacity-50"
                  onClick={handleDelete}
                >
                  <img src="/images/icons/icon-delete.svg" alt="delete icon" />
                  <span className="text-pink-400">Delete</span>
                </button>
                <button className="flex items-center gap-2 cursor-pointer hover:opacity-50">
                  <img src="/images/icons/icon-edit.svg" alt="edit icon" />
                  <span className="text-purple-600">Edit</span>
                </button>
              </div>
            ) : (
              <button
                className="hidden md:flex items-center gap-2 text-purple-600 hover:opacity-50 font-bold cursor-pointer"
                onClick={handleIsReplying}
              >
                <img src="/images/icons/icon-reply.svg" alt="icon reply" />
                Reply
              </button>
            )}
          </div>

          <p className="text-grey-500">{comment}</p>

          <div className="flex justify-between items-center mt-4 md:hidden">
            <div className="flex items-center gap-2 bg-grey-50 px-2 py-1.5 rounded-xl">
              <button className="cursor-pointer p-2 group" onClick={handleLike}>
                <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg">
                  <path
                    className={`${hasLiked ? 'fill-purple-600' : 'fill-[#C5C6EF]'} group-hover:fill-purple-600`}
                    d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 
                    .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 
                    0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 
                    0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 
                    .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z"
                    fill="#C5C6EF"
                  />
                </svg>
              </button>
              <span className="text-purple-600 font-bold">{likeCount}</span>
              <button
                className="cursor-pointer p-2 group"
                onClick={handleDislike}
              >
                <svg width="11" height="3" xmlns="http://www.w3.org/2000/svg">
                  <path
                    className="group-hover:fill-purple-600"
                    d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 
                    0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 
                    .53.167h8.495Z"
                    fill="#C5C6EF"
                  />
                </svg>
              </button>
            </div>

            {currentUser?.username === username ? ( // del / edit buttons only for the comment owner
              <div className="flex items-center gap-4 font-bold cursor-pointer">
                <button
                  className="flex items-center gap-2 cursor-pointer hover:opacity-50"
                  onClick={handleDelete}
                >
                  <img src="/images/icons/icon-delete.svg" alt="delete icon" />
                  <span className="text-pink-400">Delete</span>
                </button>
                <button className="flex items-center gap-2 cursor-pointer hover:opacity-50">
                  <img src="/images/icons/icon-edit.svg" alt="edit icon" />
                  <span className="text-purple-600">Edit</span>
                </button>
              </div>
            ) : (
              <button // if not the comment owner, show reply button
                className="flex items-center gap-2 text-purple-600 hover:opacity-50 font-bold cursor-pointer"
                onClick={handleIsReplying}
              >
                <img src="/images/icons/icon-reply.svg" alt="icon reply" />
                Reply
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Reply Area */}
      {isReplying && (
        <div>
          <CommentArea
            profileImage={currentUser.image.png}
            isReplying={isReplying}
            repliedUsername={repliedUser.username}
          />
        </div>
      )}

      {/* Replies */}
      {replies?.length > 0 && (
        <div className="md:pl-8">
          <div className="flex flex-col gap-4 border-l-2 border-grey-100 pl-4 md:pl-8">
            {replies.map((reply) => (
              <Comment
                key={reply._id}
                commentId={reply._id}
                mutate={mutate}
                profileImage={reply.user.image.png}
                username={reply.user.username}
                comment={reply.content}
                time={reply.createdAt}
                likes={reply.score}
                replies={reply.replies}
                currentUser={currentUser}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default Comment;
