function CommentActions({ isOwner, onDelete, onEdit, onReply, layoutClasses }) {
  return (
    <>
      {isOwner ? ( // del / edit buttons only for the comment owner
        <div
          className={`items-center gap-4 font-bold cursor-pointer ${layoutClasses}`}
        >
          <>
            <button
              className="flex items-center gap-2 cursor-pointer hover:opacity-50"
              onClick={onDelete}
            >
              <img src="/images/icons/icon-delete.svg" alt="delete icon" />
              <span className="text-pink-400">Delete</span>
            </button>
            <button
              className={`flex items-center gap-2 cursor-pointer hover:opacity-50`}
              onClick={onEdit}
            >
              <img src="/images/icons/icon-edit.svg" alt="edit icon" />
              <span className="text-purple-600">Edit</span>
            </button>
          </>
        </div>
      ) : (
        <button
          className={`items-center gap-2 text-purple-600 hover:opacity-50 font-bold cursor-pointer`}
          onClick={onReply}
        >
          <img src="/images/icons/icon-reply.svg" alt="icon reply" />
          Reply
        </button>
      )}
    </>
  );
}

export default CommentActions;
