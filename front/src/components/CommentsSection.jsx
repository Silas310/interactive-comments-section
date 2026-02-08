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

  if (isLoading || !currentUser) return <div>Loading...</div>;
  if (error) return <div>Error loading comments</div>;

  const handleSend = async () => {
    const newComment = {
      content: textValue,
      user: currentUser,
    };
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newComment),
      });
      if (response.ok) {
        const data = await response.json();
        mutate([...data, newComment], false);
        setTextValue('');
      }
    } catch (error) {
      console.error('Error sending comment:', error);
    }
  };

  return (
    <>
      <section
        className="flex flex-col gap-4 justify-center items-center max-md:max-w-11/12
       md:max-w-8/12 lg:max-w-7/12 xl:max-w-5/12 py-6 md:gap-6"
      >
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
          />
        )}
      </section>
    </>
  );
}

export default CommentsSection;
