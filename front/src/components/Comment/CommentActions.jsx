function CommentActions({ isOwner, onDelete, onEdit, onReply, layoutClasses }) {
  return (
    <>
      {isOwner ? ( // del / edit buttons only for the comment owner
        <div className={`flex items-center gap-4  ${layoutClasses}`}>
          <>
            <button className={`btn-action`} onClick={onDelete}>
              <img src="/images/icons/icon-delete.svg" alt="delete icon" />
              <span className="text-pink-400">Delete</span>
            </button>
            <button className={`btn-action `} onClick={onEdit}>
              <img src="/images/icons/icon-edit.svg" alt="edit icon" />
              <span className="text-purple-600">Edit</span>
            </button>
          </>
        </div>
      ) : (
        <button
          className={`btn-action text-purple-600 font-bold ${layoutClasses}`}
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
