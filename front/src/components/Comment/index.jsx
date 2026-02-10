// plan to refactor:
// let Comment be just for render a Comment
// Create new components
// - CommentScore (like and dislike buttons + like count)
// - CommentHeader (profile image, username, time)
// - CommentActions (edit, delete, reply buttons based on if its the current user or not)
// - CommentContent (the comment text + edit textarea if editing)
// Comment will then just compose these components together and pass necessary props
// separate logic for like/dislike, delete, edit, reply into custom hooks
// pass props through objects to avoid prop drilling and make it cleaner
import React, { useState } from 'react';
import CommentArea from '../CommentArea';
import CommentScore from './CommentScore';

function Comment({
  profileImage,
  username,
  comment,
  time,
  likes,
  replies,
  currentUser,
  mutate,
  handleDelete,
  commentId,
  handleReply,
  handleUpdate,
}) {
  const [likeCount, setLikeCount] = useState(likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const repliedUser = { username }; // To pass to CommentArea if replying
  const [replyText, setReplyText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment);

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

  const onReplySubmit = async () => {
    await handleReply(commentId, replyText, username);
    setReplyText('');
    setIsReplying(false);
  };

  const handleUpdateSubmit = async () => {
    await handleUpdate(commentId, editedText);
    setIsEditing(false);
  };

  return (
    <section className="flex flex-col gap-4 md:gap-6">
      <div className="flex flex-col md:flex-row md:items-start gap-4 bg-white p-4 rounded-md relative">
        {/* CommentScore start desktop*/}
        <CommentScore
          handleLike={handleLike}
          handleDislike={handleDislike}
          likeCount={likeCount}
          hasLiked={hasLiked}
        />
        {/*  CommentScore end desktop*/}

        <div className="flex-1 flex flex-col gap-2">
          {/* CommentHeader start */}
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
                  onClick={() => handleDelete(commentId)}
                >
                  <img src="/images/icons/icon-delete.svg" alt="delete icon" />
                  <span className="text-pink-400">Delete</span>
                </button>
                <button
                  className="flex items-center gap-2 cursor-pointer hover:opacity-50"
                  onClick={() => setIsEditing(!isEditing)}
                >
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
          {/* CommentHeader end */}

          {/* CommentActions start (render) */}
          {isEditing ? (
            <textarea
              className="w-full p-2 border border-gray-300 rounded"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
            />
          ) : (
            <p className="text-grey-500">{comment}</p>
          )}

          {isEditing && (
            <button
              className="flex items-center justify-center btn max-w-25 mt-2 px-4 py-2 bg-purple-600 text-white rounded self-end"
              onClick={handleUpdateSubmit}
            >
              UPDATE
            </button>
          )}
          {/* CommentActions end (render) */}

          <div className="flex justify-between items-center mt-4 md:hidden">
            {/* CommentScore start mobile */}
            <CommentScore
              handleLike={handleLike}
              handleDislike={handleDislike}
              likeCount={likeCount}
              hasLiked={hasLiked}
              layout="mobile"
            />
            {/* CommentScore end mobile */}

            {/* CommentActions start (render) */}
            {currentUser?.username === username ? ( // del / edit buttons only for the comment owner
              <div className="flex items-center gap-4 font-bold cursor-pointer">
                <button
                  className="flex items-center gap-2 cursor-pointer hover:opacity-50"
                  onClick={() => handleDelete(commentId)}
                >
                  <img src="/images/icons/icon-delete.svg" alt="delete icon" />
                  <span className="text-pink-400">Delete</span>
                </button>
                <button
                  className="flex items-center gap-2 cursor-pointer hover:opacity-50"
                  onClick={() => setIsEditing(!isEditing)}
                >
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
            {/* CommentActions end (render) */}
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
            textValue={replyText}
            setTextValue={setReplyText}
            handleSend={onReplySubmit}
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
                handleDelete={handleDelete}
                handleReply={handleReply}
                handleUpdate={handleUpdate}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default Comment;
