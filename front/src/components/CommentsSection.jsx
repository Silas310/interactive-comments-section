import Comment from './Comment';
import CommentArea from './CommentArea';
import useSWR from 'swr';
const API_URL = 'api/comments';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function CommentsSection() {
  const { data, error, isLoading } = useSWR(API_URL, fetcher);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading comments</div>;
  console.log(data);

  return (
    <>
      <section
        className="flex flex-col gap-4 justify-center items-center max-md:max-w-11/12
       md:max-w-8/12 lg:max-w-7/12 xl:max-w-5/12 py-6 md:gap-6"
      >
        {/* {data.comments.map((comment) => (
          <Comment
            key={comment.id}
            profileImage={comment.user.image.png}
            username={comment.user.username}
            comment={comment.content}
            time={comment.createdAt}
            likes={comment.score}
            replies={comment.replies}
          />
        ))} */}
        {data.map((comment) => (
          <Comment
            key={comment._id}
            profileImage={comment.user.image.png}
            username={comment.user.username}
            comment={comment.content}
            time={comment.createdAt || ''}
            likes={comment.score}
            replies={comment.replies}
          />
        ))}
        {<CommentArea />}
      </section>
    </>
  );
}

export default CommentsSection;
