import Comment from '../components/Comment';
import CommentArea from './CommentArea';
import DeleteModal from './DeleteModal';
import useSWR from 'swr';
import { useState } from 'react';
const API_URL = 'api/comments';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function CommentsSection() {
  const USER_ID = '6987ef70267511998e07adc9';
  const { data, error, isLoading, mutate } = useSWR(API_URL, fetcher);
  const { data: currentUser } = useSWR(`api/users/${USER_ID}`, fetcher);
  const [textValue, setTextValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [_commentId, _setCommentId] = useState(null);
  const [isReplying, _setIsReplying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  if (isLoading || !currentUser) return <div>Loading...</div>;
  if (error) return <div>Error loading comments</div>;

  const handleSend = async () => {
    const newComment = {
      content: textValue,
      user: currentUser,
    };

    if (!textValue.trim()) return; // Prevent triggering requests with empty comments
    setIsSending(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newComment),
      });
      if (response.ok) {
        // erase input, add comment to list immediately ensure data is up to date
        setTextValue('');
        const savedComment = await response.json();
        mutate((prevData) => [...prevData, savedComment], { revalidate: true });
      }
    } catch (error) {
      console.error('Error sending comment:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = (commentId) => {
    mutate((prevData) => prevData.filter((c) => c._id !== commentId), {
      revalidate: false,
    });

    fetch(`/api/comments/${commentId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          mutate(); // Refresh the comments list after deletion
        } else {
          console.error('Failed to delete comment');
        }
      })
      .catch((error) => {
        console.error('Error deleting comment: ', error);
      })
      .finally(() => {
        setIsModalOpen(false);
        setIdToDelete(null);
      });
  };

  const handleDeleteClick = (commentId) => {
    setIdToDelete(commentId);
    setIsModalOpen(true);
  };

  const handleReply = async (
    commentId,
    replyText,
    replyingTo,
    rootCommentId,
  ) => {
    const targetId = rootCommentId || commentId;
    if (!replyText.trim()) return;

    const newReply = {
      content: replyText,
      replyingTo: replyingTo,
      user: currentUser,
    };

    try {
      const response = await fetch(`/api/comments/${targetId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReply),
      });

      if (response.ok) {
        mutate();
      }
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  const handleUpdate = async (id, newContent) => {
    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newContent }),
      });

      if (response.ok) {
        mutate();
      }
    } catch (err) {
      console.error('Update failed', err);
    }
  };

  return (
    <>
      <section className="flex flex-col gap-4 py-6 w-full max-w-3xl mx-auto px-4 md:gap-6">
        {data.map((comment) => (
          <Comment
            key={comment._id}
            commentId={comment._id}
            profileImage={comment.user.image.png}
            username={comment.user.username}
            comment={comment.content}
            time={comment.createdAt || ''}
            likes={comment.score}
            replies={comment.replies}
            currentUser={currentUser}
            mutate={mutate}
            handleDeleteClick={handleDeleteClick}
            handleReply={handleReply}
            handleUpdate={handleUpdate}
            rootCommentId={comment._id}
          />
        ))}
        {currentUser && (
          <CommentArea
            key={currentUser._id}
            profileImage={currentUser.image.png}
            handleSend={handleSend}
            textValue={textValue}
            setTextValue={setTextValue}
            isSending={isSending}
            isReplying={isReplying}
          />
        )}
      </section>
      {isModalOpen && (
        <DeleteModal
          onDelete={() => handleDelete(idToDelete)}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

export default CommentsSection;
