import { Link } from "react-router-dom";

const AdminComment = ({ comment }) => {
  return (
    <div className="admin-comment">
      <p>
        <strong>Comment ID:</strong> {comment.id}
      </p>
      <p>
        <strong>User:</strong>{" "}
        <Link to={`/admin/users/${comment.userId}`}>{comment.userName}</Link>
      </p>
      <p>
        <strong>Product:</strong>{" "}
        <Link to={`/admin/products/${comment.productId}`}>
          {comment.productName}
        </Link>
      </p>
      <p>
        <strong>Content:</strong> {comment.content}
      </p>
      <p>
        <strong>Date:</strong> {new Date(comment.date).toLocaleString()}
      </p>
    </div>
  );
};
const fetchComments = async () => {
  try {
    const response = await api.get("/comments");
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
};

const deleteComment = async (commentId) => {
  try {
    await api.delete(`/comments/${commentId}`);
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== commentId)
    );
  } catch (error) {
    console.error("Error deleting comment:", error);
  }
};

const hideComment = async (commentId) => {
  try {
    await api.patch(`/comments/${commentId}`, { hidden: true });
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId ? { ...comment, hidden: true } : comment
      )
    );
  } catch (error) {
    console.error("Error hiding comment:", error);
  }
};

export default AdminComment;
