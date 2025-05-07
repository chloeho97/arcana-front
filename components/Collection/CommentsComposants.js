import React from "react";
import { Trash2, Reply } from "lucide-react";
import { useRouter } from "next/router";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const UserCard = ({ user, createdAt }) => {
  const router = useRouter();
  const handleNavigateToUserProfile = (userId) => {
    if (!userId) return;
    router.push(`/userProfile/${userId}`);
  };

  return (
    <div className="flex items-center">
      <img
        src={user?.avatar}
        alt="Avatar"
        className="w-8 h-8 rounded-full border border-white/20 object-cover cursor-pointer hover:border-arcanaBlue transition-all"
        onError={(e) => {
          e.target.src = "/assets/default-avatar.png";
        }}
        onClick={() => handleNavigateToUserProfile(user?._id)}
      />
      <div className="flex-1 ml-2">
        <span
          className="font-medium text-white cursor-pointer hover:text-arcanaBlue transition-colors"
          onClick={() => handleNavigateToUserProfile(user?._id)}
        >
          {user?.username || "Utilisateur inconnu"}
        </span>
        <span className="text-gray-400 text-xs ml-2">
          {formatDate(createdAt)}
        </span>
      </div>
    </div>
  );
};

const CommentActions = ({
  userData,
  item,
  showReplyForm,
  handleDeleteComment,
}) => {
  return (
    <div className="flex items-center">
      {userData.id && (
        <button
          onClick={() => showReplyForm(item._id)}
          className="text-gray-400 hover:text-arcanaBlue transition-colors p-1 rounded-full hover:bg-white/5 mr-1"
          aria-label="Répondre"
        >
          <Reply size={16} />
        </button>
      )}
      {(userData.isAdmin || userData.id === item.userId?._id) && (
        <button
          onClick={() => handleDeleteComment(item._id)}
          className="text-gray-400 hover:text-red-400 transition-colors p-1 rounded-full hover:bg-white/5"
          aria-label="Supprimer"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
};

const CommentContent = ({ item }) => {
  return (
    <p className="text-gray-200 text-sm whitespace-pre-wrap break-words pl-11">
      {item.content}
    </p>
  );
};

const ReplyForm = ({
  replyTo,
  item,
  placeholder,
  inputRef,
  content,
  setContent,
  cancelAction,
  submitting,
  handleSubmit,
}) => {
  return (
    replyTo === item._id && (
      <div className="mt-2 ml-8 border-l-2 border-arcanaBlue/30 pl-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={placeholder}
              disabled={submitting}
              className="w-full rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-2 text-white placeholder-gray-400 focus:border-arcanaBlue focus:outline-none transition-colors duration-200 pr-10 text-sm"
            />
            {content.length > 0 && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                {content.length}/500
              </span>
            )}
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={cancelAction}
              className="px-3 py-1 text-sm rounded-lg bg-transparent border border-white/10 hover:bg-white/5 text-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!content.trim() || submitting}
              className={`px-3 py-1 text-sm rounded-lg font-medium text-arcanaBackgroundDarker flex items-center gap-1 transition-colors ${
                content.trim() && !submitting
                  ? "bg-arcanaBlue hover:bg-arcanaBlue/90"
                  : "bg-arcanaBlue/50 cursor-not-allowed"
              }`}
            >
              {submitting ? (
                <div className="w-3 h-3 border-2 border-arcanaBackgroundDarker border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Reply size={14} />
              )}
              Répondre
            </button>
          </div>
        </form>
      </div>
    )
  );
};

const ToggleRepliesButton = ({
  item,
  showAllReplies,
  toggleFunction,
  isSubReply,
}) => {
  return (
    item.replies.length > 1 && (
      <button
        onClick={() => toggleFunction(item._id)}
        className={`${
          isSubReply ? "text-xs" : "text-sm"
        } text-arcanaBlue hover:underline ml-8 mt-1`}
      >
        {showAllReplies[item._id]
          ? "Afficher moins"
          : `Afficher ${item.replies.length - 1} réponse(s) supplémentaire(s)`}
      </button>
    )
  );
};

export {
  UserCard,
  CommentActions,
  CommentContent,
  ReplyForm,
  ToggleRepliesButton,
};
