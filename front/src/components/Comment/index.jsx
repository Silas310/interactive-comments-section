// plan to refactor:
// let Comment be just for render a Comment
// Create new components
// - CommentScore (like and dislike buttons + like count) V
// - CommentHeader (profile image, username, time) V
// - CommentActions (edit, delete, reply buttons based on if its the current user or not)
// - CommentContent (the comment text + edit textarea if editing)
// Comment will then just compose these components together and pass necessary props
// separate logic for like/dislike, delete, edit, reply into custom hooks
// pass props through objects to avoid prop drilling and make it cleaner
import React, { useState } from 'react';
import CommentArea from '../CommentArea';
import CommentScore from './CommentScore';
import CommentHeader from './CommentHeader';
import CommentActions from './CommentActions';

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
  const isOwner = currentUser?.username === username; // Check if the current user is the owner of the comment

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
        <CommentScore
          handleLike={handleLike}
          handleDislike={handleDislike}
          likeCount={likeCount}
          hasLiked={hasLiked}
        />

        <div className="flex-1 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <CommentHeader
              profileImage={profileImage}
              username={username}
              time={time}
              isOwner={isOwner}
            />
            {/* CommentActions start desktop */}
            <CommentActions
              isOwner={isOwner}
              onDelete={() => handleDelete(commentId)}
              onEdit={() => setIsEditing(!isEditing)}
              onReply={handleIsReplying}
              layoutClasses="hidden md:flex"
            />
          </div>
          {/* CommentActions end desktop */}

          {/* CommentContent starts */}
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
          {/* CommentContent ends */}

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

            {/* CommentActions start mobile */}
            <CommentActions
              isOwner={isOwner}
              onDelete={() => handleDelete(commentId)}
              onEdit={() => setIsEditing(!isEditing)}
              onReply={handleIsReplying}
              layoutClasses="flex"
            />
            {/* CommentActions end mobile */}
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
