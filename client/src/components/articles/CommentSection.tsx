"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Send, Trash2, Edit2, Reply, User as UserIcon, MoreHorizontal, X } from "lucide-react";
import { fetchCommentsByBlogId, createComment, deleteComment, updateComment, type BlogComment } from "@/src/lib/comments-api";
import { useAppStore } from "@/src/lib/store/store";
import { formatDistanceToNow } from "date-fns";

interface CommentSectionProps {
  blogId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ blogId }) => {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const user = useAppStore((state) => state.user);

  const loadComments = async () => {
    setLoading(true);
    const data = await fetchCommentsByBlogId(blogId);
    setComments(data);
    setLoading(false);
  };

  useEffect(() => {
    if (blogId) void loadComments();
  }, [blogId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("Please log in to comment.");
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      await createComment({ content: newComment, blogId });
      setNewComment("");
      await loadComments();
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (parentId: string, content: string) => {
    if (!user) return alert("Please log in to reply.");
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      await createComment({ content, blogId, parentId });
      await loadComments();
    } catch (err) {
      console.error("Failed to post reply:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await deleteComment(commentId, blogId);
      await loadComments();
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  const handleUpdate = async (commentId: string, content: string) => {
    if (!content.trim()) return;
    try {
      await updateComment(commentId, { content, blogId });
      await loadComments();
    } catch (err) {
      console.error("Failed to update comment:", err);
    }
  };

  return (
    <section className="mt-20 pt-20 border-t border-[#1D4E89]/10">
      <div className="flex items-center gap-3 mb-10">
        <MessageSquare className="text-[#E6693E]" size={24} />
        <h2 className="text-2xl font-serif font-black text-[#1D4E89]">Archives Discussion</h2>
        <span className="bg-[#1D4E89]/5 px-3 py-1 rounded-full text-[10px] font-black text-[#1D4E89]/40 uppercase tracking-widest">
          {comments.length} Transmissions
        </span>
      </div>

      {/* Comment Input */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-16">
          <div className="relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Join the discourse..."
              className="w-full bg-white border border-[#1D4E89]/10 rounded-[1.5rem] p-6 text-sm font-serif text-[#1D4E89] focus:outline-none focus:ring-2 focus:ring-[#1D4E89]/5 min-h-[120px] resize-none placeholder:text-[#1D4E89]/20"
            />
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="absolute bottom-4 right-4 bg-[#1D4E89] text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
            >
              {submitting ? "Sending..." : (
                <>
                  <Send size={12} />
                  Dispatch
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-[#1D4E89]/5 rounded-[1.5rem] p-8 text-center mb-16">
          <p className="text-sm font-serif italic text-[#1D4E89]/60">Authentication required to participate in the discussion.</p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-8">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </div>
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-4 w-2/3 bg-gray-200 rounded" />
            </div>
          ))
        ) : comments.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-sm font-serif italic text-[#1D4E89]/30">The archives are quiet. Be the first to speak.</p>
          </div>
        ) : (
          comments.filter(c => !c.parentId).map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={handleReply}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              currentUser={user}
              allComments={comments}
            />
          ))
        )}
      </div>
    </section>
  );
};

const CommentItem: React.FC<{
  comment: BlogComment;
  onReply: (parentId: string, content: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, content: string) => void;
  currentUser: any;
  allComments: BlogComment[];
  depth?: number;
}> = ({ comment, onReply, onDelete, onUpdate, currentUser, allComments, depth = 0 }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);

  const replies = allComments.filter(c => c.parentId === comment.id);
  const isOwner = currentUser?.id === comment.userId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group ${depth > 0 ? "ml-8 mt-6 pl-6 border-l border-[#1D4E89]/5" : ""}`}
    >
      <div className="flex items-start gap-4">
        <div className="w-8 h-8 rounded-full bg-[#1D4E89]/5 flex items-center justify-center text-[#1D4E89]/40 flex-shrink-0">
          <UserIcon size={14} />
        </div>
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <span className="text-xs font-black text-[#1D4E89] uppercase tracking-wider">{comment.user?.name || "Anonymous Resident"}</span>
              <span className="text-[10px] text-[#1D4E89]/30 font-sans">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </span>
              {comment.edited && (
                <span className="text-[9px] text-[#E6693E]/40 font-black uppercase tracking-widest italic">(edited)</span>
              )}
            </div>
            {isOwner && !isEditing && (
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setIsEditing(true)} className="text-[#1D4E89]/40 hover:text-[#1D4E89]">
                  <Edit2 size={12} />
                </button>
                <button onClick={() => onDelete(comment.id)} className="text-[#1D4E89]/40 hover:text-red-500">
                  <Trash2 size={12} />
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full bg-white border border-[#1D4E89]/10 rounded-xl p-3 text-sm font-serif text-[#1D4E89] focus:outline-none"
              />
              <div className="flex justify-end gap-2 mt-2">
                <button onClick={() => setIsEditing(false)} className="text-[9px] font-black uppercase tracking-widest text-[#1D4E89]/40">Cancel</button>
                <button
                  onClick={() => {
                    onUpdate(comment.id, editText);
                    setIsEditing(false);
                  }}
                  className="text-[9px] font-black uppercase tracking-widest text-[#E6693E]"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm font-serif text-[#1D4E89]/80 leading-relaxed whitespace-pre-wrap">
              {comment.content}
            </p>
          )}

          <div className="mt-3 flex items-center gap-4">
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-[#1D4E89]/40 hover:text-[#E6693E] transition-colors"
            >
              <Reply size={10} />
              {isReplying ? "Cancel Reply" : "Reply"}
            </button>
          </div>

          {/* Reply Input */}
          <AnimatePresence>
            {isReplying && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4"
              >
                <div className="relative">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Dispatch a reply..."
                    className="w-full bg-white border border-[#1D4E89]/10 rounded-xl p-4 text-xs font-serif text-[#1D4E89] focus:outline-none min-h-[80px] resize-none"
                  />
                  <button
                    onClick={() => {
                      onReply(comment.id, replyText);
                      setIsReplying(false);
                      setReplyText("");
                    }}
                    disabled={!replyText.trim()}
                    className="absolute bottom-3 right-3 text-[9px] font-black uppercase tracking-widest text-[#E6693E] disabled:opacity-30"
                  >
                    Send Reply
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Render Replies Recursively */}
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onDelete={onDelete}
              onUpdate={onUpdate}
              currentUser={currentUser}
              allComments={allComments}
              depth={depth + 1}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CommentSection;
