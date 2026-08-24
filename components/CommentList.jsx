import CommentItem from "./CommentItem";

export default function CommentList({ comments }) {
  if (!comments || comments.length === 0) {
    return <p className="text-sm text-vybe-muted">No comments yet. Be the first to react!</p>;
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
