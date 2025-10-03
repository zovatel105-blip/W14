import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, MessageCircle, MoreHorizontal, Edit3, Trash2, 
  ChevronDown, ChevronUp, Reply, Flag, CheckCircle, Send, Sparkles
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

const CommentForm = ({ 
  onSubmit, 
  onCancel, 
  placeholder = "Escribe un comentario...", 
  initialValue = "",
  isReply = false,
  isEditing = false 
}) => {
  const [content, setContent] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(content.trim());
      setContent('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit(e);
    }
  };

  return (
    <motion.form 
      className={cn(
        "space-y-4 p-5 rounded-2xl border-2 bg-white/90 backdrop-blur-sm shadow-lg",
        isReply ? "ml-8 border-indigo-200 bg-gradient-to-r from-indigo-50/50 to-purple-50/50" : "border-gray-200"
      )}
      onSubmit={handleSubmit}
      initial={{ opacity: 0, height: 0, scale: 0.95 }}
      animate={{ opacity: 1, height: 'auto', scale: 1 }}
      exit={{ opacity: 0, height: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-4 py-4 pr-20 border-2 border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all duration-200 placeholder:text-gray-400 bg-white/80 backdrop-blur-sm"
          rows={isReply ? 3 : 4}
          maxLength={500}
          autoFocus
        />
        <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded-lg">
          {content.length}/500
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <kbd className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg font-mono">⌘+↵</kbd>
          <span>envío rápido</span>
        </div>
        
        <div className="flex items-center gap-3">
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-xl"
            >
              Cancelar
            </Button>
          )}
          
          <Button
            type="submit"
            size="sm"
            disabled={!content.trim() || isSubmitting}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                {isEditing ? 'Guardar' : 'Comentar'}
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.form>
  );
};

const Comment = ({ 
  comment, 
  onReply, 
  onEdit, 
  onDelete, 
  onLike, 
  depth = 0, 
  maxDepth = 3 
}) => {
  const { user: currentUser } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const isAuthor = currentUser && currentUser.id === comment.user.id;
  const canReply = depth < maxDepth;
  const hasReplies = comment.replies && comment.replies.length > 0;

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      await onLike(comment.id);
    } catch (error) {
      console.error('Error liking comment:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleReply = async (content) => {
    try {
      await onReply(comment.id, content);
      setShowReplyForm(false);
    } catch (error) {
      console.error('Error replying:', error);
      throw error;
    }
  };

  const handleEdit = async (content) => {
    try {
      await onEdit(comment.id, content);
      setShowEditForm(false);
    } catch (error) {
      console.error('Error editing comment:', error);
      throw error;
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este comentario? Esta acción no se puede deshacer.')) {
      try {
        await onDelete(comment.id);
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'ahora';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d`;
    
    return date.toLocaleDateString('es', { month: 'short', day: 'numeric' });
  };

  return (
    <motion.div
      className={cn(
        "comment-thread",
        depth > 0 && "ml-6 pl-6 border-l-2 border-gradient-to-b from-indigo-100 to-purple-100"
      )}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: depth * 0.1 }}
    >
      <div className="comment-item bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-gray-100/80 hover:shadow-lg hover:bg-white/90 transition-all duration-300">
        {/* Header del comentario con diseño moderno */}
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="w-11 h-11 flex-shrink-0 ring-2 ring-white shadow-lg">
            <AvatarImage src={comment.user.avatar_url} />
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-sm">
              {((comment.user.display_name || comment.user.username || 'U') + '').charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-gray-900 text-sm">
                {comment.user.display_name || comment.user.username}
              </span>
              
              {comment.user.is_verified && (
                <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-white fill-current" />
                </div>
              )}
              
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {formatTimeAgo(comment.created_at)}
              </span>
              
              {comment.is_edited && (
                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">editado</span>
              )}
              
              {comment.status === 'sending' && (
                <span className="text-xs text-orange-500 bg-orange-50 px-2 py-1 rounded-full flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Enviando...
                </span>
              )}
            </div>
            
            {/* Contenido del comentario */}
            {showEditForm ? (
              <CommentForm
                onSubmit={handleEdit}
                onCancel={() => setShowEditForm(false)}
                placeholder="Editar comentario..."
                initialValue={comment.content}
                isEditing={true}
              />
            ) : (
              <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            )}
          </div>
          
          {/* Menú de acciones con diseño moderno */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMenu(!showMenu)}
              className="h-8 w-8 p-0 hover:bg-gray-100/80 rounded-xl transition-all duration-200"
            >
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </Button>
            
            <AnimatePresence>
              {showMenu && (
                <motion.div 
                  className="absolute right-0 top-10 bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-2xl py-2 z-20 min-w-[140px] overflow-hidden"
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {isAuthor && (
                    <>
                      <button
                        onClick={() => {
                          setShowEditForm(true);
                          setShowMenu(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                        Editar
                      </button>
                      <button
                        onClick={() => {
                          handleDelete();
                          setShowMenu(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </button>
                      <div className="h-px bg-gray-200 mx-2 my-1" />
                    </>
                  )}
                  
                  <button
                    onClick={() => setShowMenu(false)}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                  >
                    <Flag className="w-4 h-4" />
                    Reportar
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Acciones del comentario con diseño moderno */}
        <div className="flex items-center gap-2 text-sm">
          <motion.button
            onClick={handleLike}
            disabled={isLiking}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 font-medium",
              comment.user_liked 
                ? "text-red-600 bg-red-50 hover:bg-red-100 shadow-md" 
                : "text-gray-600 hover:text-red-600 hover:bg-red-50 hover:shadow-md"
            )}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
          >
            <Heart className={cn(
              "w-4 h-4 transition-all duration-200",
              comment.user_liked && "fill-current scale-110"
            )} />
            {comment.likes > 0 && (
              <span>{comment.likes}</span>
            )}
          </motion.button>
          
          {canReply && (
            <motion.button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 font-medium hover:shadow-md"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
            >
              <Reply className="w-4 h-4" />
              Responder
            </motion.button>
          )}
          
          {hasReplies && (
            <motion.button
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-200 font-medium hover:shadow-md"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
            >
              {showReplies ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold">
                {comment.reply_count}
              </span>
              {comment.reply_count === 1 ? 'respuesta' : 'respuestas'}
            </motion.button>
          )}
        </div>
      </div>
      
      {/* Formulario de respuesta */}
      <AnimatePresence>
        {showReplyForm && (
          <div className="mt-4">
            <CommentForm
              onSubmit={handleReply}
              onCancel={() => setShowReplyForm(false)}
              placeholder={`Responder a ${comment.user.display_name || comment.user.username}...`}
              isReply={true}
            />
          </div>
        )}
      </AnimatePresence>
      
      {/* Respuestas anidadas */}
      <AnimatePresence>
        {showReplies && hasReplies && (
          <motion.div 
            className="replies-container mt-6 space-y-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {comment.replies.map((reply, index) => (
              <Comment
                key={reply.id}
                comment={reply}
                onReply={onReply}
                onEdit={onEdit}
                onDelete={onDelete}
                onLike={onLike}
                depth={depth + 1}
                maxDepth={maxDepth}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Overlay para cerrar menú al hacer click fuera */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-10"
          onClick={() => setShowMenu(false)}
        />
      )}
    </motion.div>
  );
};

export default Comment;