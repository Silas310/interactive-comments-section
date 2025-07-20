import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function Comment() {
  const { data } = useSWR('data/data.json', fetcher);
  console.log(data);

  return (
    <>
      <div>
        <div>
          <img alt="profile" />
          <h2></h2>
          <span></span>
          <p></p>
        </div>
        <button></button>
        <button>Reply</button>
      </div>
    </>
  );
}

export default Comment;
