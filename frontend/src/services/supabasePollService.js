import { supabase } from '../lib/supabase';

class SupabasePollService {
  
  // Create a new poll with media transform support
  async createPoll(pollData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // 1. Create the poll
      const { data: poll, error: pollError } = await supabase
        .from('polls')
        .insert({
          title: pollData.title,
          description: pollData.description || '',
          author_id: user.id,
          music_id: pollData.music_id,
          layout_id: pollData.layout_id || 'single',
          background_color: pollData.background_color || '#ffffff',
          tags: pollData.tags || []
        })
        .select()
        .single();

      if (pollError) throw pollError;

      // 2. Create poll options with media_transform support
      const optionsToInsert = pollData.options.map(option => ({
        poll_id: poll.id,
        user_id: user.id,
        text: option.text || '',
        media_type: option.media_type,
        media_url: option.media_url,
        thumbnail_url: option.thumbnail_url,
        media_transform: option.media_transform, // ✅ Direct JSON support - no conversion needed!
        mentioned_users: option.mentioned_users || []
      }));

      const { data: options, error: optionsError } = await supabase
        .from('poll_options')
        .insert(optionsToInsert)
        .select();

      if (optionsError) throw optionsError;

      console.log('✅ Poll created with media_transform:', {
        poll_id: poll.id,
        options_with_transform: options.filter(opt => opt.media_transform)
      });

      return {
        ...poll,
        options: options
      };

    } catch (error) {
      console.error('❌ Error creating poll:', error);
      throw error;
    }
  }

  // Get polls with media transform data
  async getPolls(limit = 20, offset = 0) {
    try {
      // Get current user first
      const { data: { user } } = await supabase.auth.getUser();

      const { data: polls, error: pollsError } = await supabase
        .from('polls')
        .select(`
          *,
          author:profiles(id, username, display_name, avatar_url, is_verified),
          options:poll_options(
            id,
            text,
            votes,
            media_type,
            media_url,
            thumbnail_url,
            media_transform,
            mentioned_users,
            user:profiles(id, username, display_name, avatar_url)
          ),
          poll_likes(user_id),
          votes(user_id, option_id)
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (pollsError) throw pollsError;

      // Transform data to match frontend expectations
      return polls.map(poll => ({
        id: poll.id,
        title: poll.title,
        description: poll.description,
        author: poll.author,
        totalVotes: poll.total_votes,
        likes: poll.likes,
        musicId: poll.music_id,
        layoutId: poll.layout_id,
        backgroundColor: poll.background_color,
        tags: poll.tags,
        createdAt: poll.created_at,
        isLiked: poll.poll_likes?.some(like => like.user_id === user?.id),
        options: poll.options.map(option => ({
          id: option.id,
          text: option.text,
          votes: option.votes,
          user: option.user,
          mentionedUsers: option.mentioned_users,
          media: option.media_url ? {
            type: option.media_type,
            url: option.media_url,
            thumbnail: option.thumbnail_url,
            transform: option.media_transform // ✅ Transform data preserved directly from DB
          } : null,
          hasVoted: poll.votes?.some(vote => 
            vote.option_id === option.id && vote.user_id === user?.id
          )
        }))
      }));

    } catch (error) {
      console.error('❌ Error fetching polls:', error);
      throw error;
    }
  }

  // Vote on a poll
  async voteOnPoll(pollId, optionId) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if user already voted
      const { data: existingVote } = await supabase
        .from('votes')
        .select('*')
        .eq('poll_id', pollId)
        .eq('user_id', user.id)
        .single();

      if (existingVote) {
        // Update existing vote
        const { error } = await supabase
          .from('votes')
          .update({ option_id: optionId })
          .eq('poll_id', pollId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Create new vote
        const { error } = await supabase
          .from('votes')
          .insert({
            poll_id: pollId,
            option_id: optionId,
            user_id: user.id
          });

        if (error) throw error;
      }

      return { success: true };

    } catch (error) {
      console.error('❌ Error voting on poll:', error);
      throw error;
    }
  }

  // Like/unlike a poll
  async togglePollLike(pollId) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: existingLike } = await supabase
        .from('poll_likes')
        .select('*')
        .eq('poll_id', pollId)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        // Unlike
        const { error } = await supabase
          .from('poll_likes')
          .delete()
          .eq('poll_id', pollId)
          .eq('user_id', user.id);

        if (error) throw error;

        // Update poll likes count
        await supabase.rpc('decrement_poll_likes', { poll_id: pollId });

        return { liked: false, message: 'Poll unliked' };
      } else {
        // Like
        const { error } = await supabase
          .from('poll_likes')
          .insert({
            poll_id: pollId,
            user_id: user.id
          });

        if (error) throw error;

        // Update poll likes count
        await supabase.rpc('increment_poll_likes', { poll_id: pollId });

        return { liked: true, message: 'Poll liked' };
      }

    } catch (error) {
      console.error('❌ Error toggling poll like:', error);
      throw error;
    }
  }

  // Get poll by ID
  async getPollById(pollId) {
    try {
      const { data: poll, error } = await supabase
        .from('polls')
        .select(`
          *,
          author:profiles(id, username, display_name, avatar_url, is_verified),
          options:poll_options(
            id,
            text,
            votes,
            media_type,
            media_url,
            thumbnail_url,
            media_transform,
            mentioned_users,
            user:profiles(id, username, display_name, avatar_url)
          ),
          poll_likes(user_id),
          votes(user_id, option_id)
        `)
        .eq('id', pollId)
        .single();

      if (error) throw error;

      // Transform data same as getPolls
      const { data: { user } } = await supabase.auth.getUser();

      return {
        id: poll.id,
        title: poll.title,
        description: poll.description,
        author: poll.author,
        totalVotes: poll.total_votes,
        likes: poll.likes,
        musicId: poll.music_id,
        layoutId: poll.layout_id,
        backgroundColor: poll.background_color,
        tags: poll.tags,
        createdAt: poll.created_at,
        isLiked: poll.poll_likes?.some(like => like.user_id === user?.id),
        options: poll.options.map(option => ({
          id: option.id,
          text: option.text,
          votes: option.votes,
          user: option.user,
          mentionedUsers: option.mentioned_users,
          media: option.media_url ? {
            type: option.media_type,
            url: option.media_url,
            thumbnail: option.thumbnail_url,
            transform: option.media_transform // ✅ Transform data preserved
          } : null,
          hasVoted: poll.votes?.some(vote => 
            vote.option_id === option.id && vote.user_id === user?.id
          )
        }))
      };

    } catch (error) {
      console.error('❌ Error fetching poll by ID:', error);
      throw error;
    }
  }
}

export default new SupabasePollService();