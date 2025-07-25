function Comment({ profileImage, username, comment, time, likes, replies }) {
  console.log(replies);
  return (
    <>
      <section className="flex flex-col gap-4">
        <div className="bg-white">
          <div>
            <img src={profileImage} alt="profile image" />
            <h2>{username}</h2>
            <span>{time}</span>
            <p>{comment}</p>
          </div>
          <button>{likes}</button>
          <button>Reply</button>
        </div>

        {replies?.length > 0 && (
          <div className="flex flex-col gap-4">
            {replies.map((reply) => (
              <Comment
                key={reply.id}
                profileImage={reply.user.image.png}
                username={reply.user.username}
                comment={reply.content}
                time={reply.createdAt}
                likes={reply.score}
                replies={reply.replies}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default Comment;
