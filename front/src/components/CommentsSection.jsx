import Comment from './Comment';
import CommentArea from './CommentArea';
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
      if (response.ok) { // erase input, add comment to list immediately ensure data is up to date
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
          />
        )}
      </section>
    </>
  );
}

export default CommentsSection;
