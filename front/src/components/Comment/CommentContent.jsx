function CommentContent({
  comment,
  editedText,
  setEditedText,
  isEditing,
  handleUpdateSubmit,
}) {
  const renderUsername = () => {
    if (comment.startsWith('@')) {
      const words = comment.split(' ');
      const username = words[0];
      const rest = words.slice(1).join(' ');
      return (
        <>
          <span className="text-purple-600 font-bold">{username}</span> {rest}
        </>
      );
    }
    return comment;
  };
  return (
    <>
      {isEditing ? (
        <textarea
          className="w-full p-2 border border-gray-300 rounded"
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
        />
      ) : (
        <p className="text-grey-500">{renderUsername()}</p> // mod
      )}

      {isEditing && (
        <button
          className="flex items-center justify-center btn max-w-25 mt-2 px-4 py-2 bg-purple-600 text-white rounded self-end"
          onClick={handleUpdateSubmit}
        >
          UPDATE
        </button>
      )}
    </>
  );
}

export default CommentContent;
