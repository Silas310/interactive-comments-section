import Comment from './Comment';
import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function CommentsSection() {
  const { data, error, isLoading } = useSWR('data/data.json', fetcher);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading comments</div>;

  return (
    <>
      <section>
        {data.comments.map(
          (comment) => (
            console.log(comment),
            (
              <Comment
                key={comment.id}
                profileImage={comment.user.image.png}
                username={comment.user.username}
                comment={comment.content}
                time={comment.createdAt}
                likes={comment.score}
              />
            )
          ),
        )}
      </section>
    </>
  );
}

export default CommentsSection;
