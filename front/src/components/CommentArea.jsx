function CommentArea({
  profileImage,
  handleSend,
  textValue,
  setTextValue,
  isSending,
  isReplying,
}) {
  return (
    <div className="bg-white rounded-lg w-full p-4 md:p-5 grid md:flex grid-cols-[1fr_4fr_1fr] grid-rows-[3fr_1fr] md:gap-4 gap-y-8">
      <img
        src={profileImage}
        alt="User profile img"
        className="w-10 h-10 rounded-full justify-self-start "
      />
      <textarea
        name="comment"
        id="comment"
        className="w-full outline-grey-100 hover:outline-purple-600 hover:cursor-pointer outline-1 resize-none text-grey-800 rounded-md px-4 py-2 pb-6 col-span-full row-end-2 h-full"
        placeholder="Add a comment..."
        value={textValue}
        onChange={(e) => setTextValue(e.target.value)}
      ></textarea>
      <button
        onClick={handleSend}
        className="btn max-h-10 col-end-4 justify-self-end"
        disabled={isSending}
      >
        {isReplying ? 'REPLY' : 'SEND'}
      </button>
    </div>
  );
}

export default CommentArea;
