function Comment({ profileImage, username, comment, time, likes, replies }) {
  console.log(replies);
  return (
    <>
      <section className="flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <img
                src={profileImage}
                alt="profile image"
                className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover"
              />
              <h2 className="text-grey-800 font-bold">{username}</h2>
              <span className="text-grey-500">{time}</span>
            </div>
            <p className="text-grey-500">{comment}</p>
          </div>
          <button className="text-purple-600 font-bold bg-grey-100 px-4 rounded-md">
            {likes}
          </button>
          <button className="text-purple-600 font-bold">Reply</button>
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
