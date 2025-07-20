function Comment({ profileImage, username, comment, time, likes }) {
  console.log(profileImage);

  return (
    <>
      <section>
        <div>
          <img src={profileImage} alt="profile image" />
          <h2>{username}</h2>
          <span>{time}</span>
          <p>{comment}</p>
        </div>
        <button>{likes}</button>
        <button>Reply</button>
      </section>
    </>
  );
}

export default Comment;
