import React, { useState, useCallback, memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addComment,
  likePost,
  deletePost,
  deleteComment,
} from "../../actions/PostAction";
import { Dropdown, Button } from "react-bootstrap";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  CheckCircle,
  Trash,
} from "lucide-react";
import { motion } from "framer-motion";

const styles = {
  container: {
    backgroundColor: "#000",
    color: "#fff",
    borderRadius: "8px",
    marginBottom: "20px",
    border: "1px solid #262626",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  username: {
    fontWeight: "bold",
    fontSize: "14px",
  },
  verified: {
    color: "#3897f0",
    marginLeft: "4px",
  },
  imageContainer: {
    width: "100%",
    aspectRatio: "1 / 1",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#262626",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-start",
    padding: "14px",
    gap: "16px",
  },
  likes: {
    padding: "0 14px",
    fontSize: "14px",
    fontWeight: "bold",
  },
  caption: {
    padding: "0 14px 14px",
    fontSize: "14px",
  },
  comments: {
    padding: "0 14px",
  },
  commentForm: {
    display: "flex",
    padding: "14px",
    borderTop: "1px solid #262626",
  },
  commentInput: {
    flex: 1,
    background: "none",
    border: "none",
    color: "#fff",
    outline: "none",
  },
  postButton: {
    background: "none",
    border: "none",
    color: "#0095f6",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

const Post = memo(function Post(props) {
  const {
    post_id,
    username,
    profile_pic,
    media,
    likes: initialLikes,
    caption,
    comments,
    isLiked: initiallyLiked,
    isVerified,
  } = props;

  const dispatch = useDispatch();
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [localLikes, setLocalLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initiallyLiked);

  useEffect(() => {
    setLiked(initiallyLiked);
    setLocalLikes(initialLikes);
  }, [initiallyLiked, initialLikes]);

  const currentUser = useSelector(
    (state) => state.userSignin.userInfo?.username
  );

  const handleLike = useCallback(() => {
    dispatch(likePost(post_id, liked));
    setLiked((prev) => !prev);
    setLocalLikes((prev) => (liked ? prev - 1 : prev + 1));
  }, [dispatch, post_id, liked]);

  const handleComment = useCallback(
    (e) => {
      e.preventDefault();
      if (newComment.trim()) {
        dispatch(addComment(post_id, newComment));
        setNewComment("");
      }
    },
    [dispatch, post_id, newComment]
  );

  const handleDeleteComment = useCallback(
    (comment_Id) => {
      dispatch(deleteComment(post_id, comment_Id));
    },
    [dispatch, post_id]
  );

  const handleDelete = useCallback(() => {
    dispatch(deletePost(post_id));
  }, [dispatch, post_id]);

  const isPostOwner = currentUser === username;

  return (
    <motion.div
      style={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={styles.header}>
        <div style={styles.userInfo}>
          <img
            src={profile_pic || "https://via.placeholder.com/150"}
            alt={username}
            style={styles.avatar}
          />
          <span style={styles.username}>
            {username}
            {isVerified && <CheckCircle style={styles.verified} size={16} />}
          </span>
        </div>
        {isPostOwner && (
          <Dropdown>
            <Dropdown.Toggle as={CustomToggle}>
              <MoreHorizontal size={24} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleDelete}>Delete post</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>

      <div style={styles.imageContainer}>
        <img
          src={media || "https://via.placeholder.com/600"}
          alt="Post content"
          style={styles.image}
        />
      </div>

      {currentUser && (
        <div style={styles.actions}>
          <motion.div whileTap={{ scale: 1.2 }}>
            <Button variant="ghost" size="icon" onClick={handleLike}>
              <Heart
                color={liked ? "red" : "gray"}
                fill={liked ? "red" : "none"}
              />
            </Button>
          </motion.div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle />
          </Button>
        </div>
      )}

      <div style={styles.likes}>{localLikes.toLocaleString()} likes</div>

      <div style={styles.caption}>
        <span style={styles.username}>{username}</span> {caption}
      </div>

      {currentUser && showComments && (
        <div style={styles.comments}>
          {comments.map((content) => (
            <motion.div
              key={content.post_id}
              style={{
                marginBottom: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div>
                <span style={styles.username}>{content.username}</span>{" "}
                {content.text}
              </div>
              {content.username === currentUser && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteComment(content.post_id)}
                >
                  <Trash size={14} />
                </Button>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {currentUser && (
        <form onSubmit={handleComment} style={styles.commentForm}>
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            style={styles.commentInput}
          />
          <button
            type="submit"
            style={styles.postButton}
            disabled={!newComment.trim()}
          >
            Post
          </button>
        </form>
      )}
    </motion.div>
  );
});

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <Button
    variant="ghost"
    size="icon"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
  </Button>
));

export default Post;
