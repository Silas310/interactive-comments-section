import ReactDOM from 'react-dom';

function DeleteModal({ onDelete, onCancel }) {
  const content = (
    <div className="fixed inset-0 w-full h-full bg-black/50 z-[9999] flex items-center justify-center px-4">
      <div className="flex flex-col gap-4 bg-white p-7 md:p-8 rounded-lg max-w-[380px] w-full shadow-md">
        <h2 className="text-xl font-bold text-grey-800 mb-4">Delete comment</h2>

        <p className="text-grey-500 leading-relaxed mb-6">
          Are you sure you want to delete this comment? This will remove the
          comment and can't be undone.
        </p>

        <div className="flex gap-x-5">
          <button
            className="flex-1 bg-grey-500 text-white font-bold py-3 rounded-lg uppercase cursor-pointer hover:opacity-60 transition-opacity"
            onClick={onCancel}
          >
            NO, CANCEL
          </button>

          <button
            className="flex-1 bg-pink-400 text-white font-bold py-3 rounded-lg uppercase cursor-pointer hover:opacity-60 transition-opacity"
            onClick={onDelete}
          >
            YES, DELETE
          </button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
}

export default DeleteModal;
