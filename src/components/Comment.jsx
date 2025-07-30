function Comment({ profileImage, username, comment, time, likes, replies }) {
  console.log(replies);
  return (
    <>
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 bg-white p-4 rounded-md">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-2">
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
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-3 bg-grey-50 px-3.5 py-1.5 rounded-xl">
              <button>
                <img src="/images/icons/icon-plus.svg" alt="icon plus" />
              </button>
              <span className="text-purple-600 font-bold">{likes}</span>
              <button>
                <img src="/images/icons/icon-minus.svg" alt="icon minus" />
              </button>
            </div>

            <button className="flex items-center gap-2 text-purple-600 font-bold">
              <img src="/images/icons/icon-reply.svg" alt="icon reply" />
              Reply
            </button>
          </div>
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
