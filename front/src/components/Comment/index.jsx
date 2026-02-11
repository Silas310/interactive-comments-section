import React, { useState } from 'react';
import CommentArea from '../CommentArea';
import CommentScore from './CommentScore';
import CommentHeader from './CommentHeader';
import CommentActions from './CommentActions';
import CommentContent from './CommentContent';

function Comment({
  profileImage,
  username,
  comment,
  time,
  likes,
  replies,
  currentUser,
  mutate,
  handleDeleteClick,
  commentId,
  handleReply,
  handleUpdate,
  rootCommentId,
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
    if (!isReplying) {
      setReplyText(`@${username} `);
    } else {
      setReplyText('');
    }
    setIsReplying(!isReplying);
  };

  const onReplySubmit = async () => {
    await handleReply(commentId, replyText, username, rootCommentId);
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
            <CommentActions
              isOwner={isOwner}
              onDelete={() => handleDeleteClick(commentId)}
              onEdit={() => setIsEditing(!isEditing)}
              onReply={handleIsReplying}
              layoutClasses="hidden md:flex"
            />
          </div>

          {/* CommentContent starts */}
          <CommentContent
            comment={comment}
            editedText={editedText}
            setEditedText={setEditedText}
            isEditing={isEditing}
            handleUpdateSubmit={handleUpdateSubmit}
          />
          {/* CommentContent ends */}

          <div className="flex justify-between items-center mt-4 md:hidden">
            <CommentScore
              handleLike={handleLike}
              handleDislike={handleDislike}
              likeCount={likeCount}
              hasLiked={hasLiked}
              layout="mobile"
            />

            <CommentActions
              isOwner={isOwner}
              onDelete={() => handleDeleteClick(commentId)}
              onEdit={() => setIsEditing(!isEditing)}
              onReply={handleIsReplying}
              layoutClasses="flex"
            />
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
                handleDeleteClick={handleDeleteClick}
                handleReply={handleReply}
                handleUpdate={handleUpdate}
                rootCommentId={rootCommentId}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default Comment;
