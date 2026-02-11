function DeleteModal() {
  return (
    <div className="delete-modal z-1">
      <h2 className="text-lg font-bold">Delete comment</h2>
      <p className="text-sm text-gray-600">
        Are you sure you want to delete this comment? This will remove the
        comment and can't be undone.
      </p>
      <div className="flex gap-4 mt-4">
        <button className="bg-red-500 text-white px-4 py-2 rounded">
          Delete
        </button>
        <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default DeleteModal;
