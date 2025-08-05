function CommentArea() {
  return (
    <div className="bg-white rounded-lg w-full p-4">
      <textarea
        name="comment"
        id="comment"
        className="w-full outline-grey-100 outline-1 resize-none text-grey-800 rounded-md px-4 py-2 h-1/2 pb-6"
        placeholder="Add a comment..."
      ></textarea>
      <img src="" alt="" />
      <button className="btn">SEND</button>
    </div>
  );
}

export default CommentArea;
