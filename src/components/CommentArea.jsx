function CommentArea({ profileImage }) {
  return (
    <div className="bg-white rounded-lg w-full p-4 md:p-5 grid md:flex grid-cols-[1fr_4fr_1fr] grid-rows-2 md:gap-4">
      <img
        src={profileImage}
        alt="User profile img"
        className="w-10 h-10 rounded-full justify-self-end "
      />
      <textarea
        name="comment"
        id="comment"
        className="w-full outline-grey-100 outline-1 resize-none text-grey-800 rounded-md px-4 py-2 h-1/2 pb-6 col-span-full row-end-1"
        placeholder="Add a comment..."
      ></textarea>
      <button className="btn max-h-10">SEND</button>
    </div>
  );
}

export default CommentArea;
