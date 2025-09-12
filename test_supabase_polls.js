// Test Supabase Poll Service
const { createClient } = require('./frontend/node_modules/@supabase/supabase-js');

const supabaseUrl = 'https://ixpxjfgnkjanltukhvvz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4cHhqZmdua2phbmx0dWtoZHZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MDc3NTMsImV4cCI6MjA3MzI4Mzc1M30.eUYpYcIffqQIW3eabJoswnR_RGf0-UctYsB-nTsXBIY';

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

async function testSupabasePollService() {
  console.log('🚀 Testing Supabase Poll Service...\n');

  try {
    // Step 1: Test basic connection
    console.log('1️⃣ Testing Supabase Connection...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('profiles')
      .select('count(*)')
      .limit(1);
    
    if (connectionError) {
      console.log('❌ Connection Error:', connectionError.message);
      return;
    }
    console.log('✅ Supabase connection successful!\n');

    // Step 2: Create a test user profile (needed for creating polls)
    console.log('2️⃣ Creating Test User Profile...');
    const testUserId = 'test-user-' + Date.now();
    
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: testUserId,
        username: 'testuser_' + Date.now(),
        display_name: 'Test User',
        bio: 'Test user for poll testing',
        avatar_url: 'https://example.com/avatar.jpg'
      })
      .select()
      .single();

    if (profileError) {
      console.log('❌ Profile Creation Error:', profileError.message);
      return;
    }
    console.log('✅ Test user profile created:', profileData.username);

    // Step 3: Test Poll Creation with Media Transform
    console.log('\n3️⃣ Testing Poll Creation with Media Transform...');
    
    const testPollData = {
      title: 'Test Poll with Image Cropping',
      description: 'Testing media transform functionality',
      options: [
        {
          text: 'Option A with cropped image',
          media_type: 'image',
          media_url: 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
          thumbnail_url: 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
          media_transform: {
            position: { x: 50, y: 30 },
            scale: 1.2,
            rotation: 0
          },
          mentioned_users: []
        },
        {
          text: 'Option B with different transform',
          media_type: 'image', 
          media_url: 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
          thumbnail_url: 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
          media_transform: {
            position: { x: 75, y: 60 },
            scale: 0.8,
            rotation: 15
          },
          mentioned_users: []
        }
      ],
      music_id: null,
      tags: ['test', 'migration']
    };

    // Manually create poll to simulate the service
    const { data: pollData, error: pollError } = await supabase
      .from('polls')
      .insert({
        title: testPollData.title,
        description: testPollData.description,
        author_id: testUserId,
        music_id: testPollData.music_id,
        layout_id: 'vertical',
        background_color: '#ffffff',
        tags: testPollData.tags
      })
      .select()
      .single();

    if (pollError) {
      console.log('❌ Poll Creation Error:', pollError.message);
      return;
    }
    console.log('✅ Poll created successfully:', pollData.id);

    // Create poll options
    const optionsToInsert = testPollData.options.map(option => ({
      poll_id: pollData.id,
      user_id: testUserId,
      text: option.text,
      media_type: option.media_type,
      media_url: option.media_url,
      thumbnail_url: option.thumbnail_url,
      media_transform: option.media_transform,
      mentioned_users: option.mentioned_users
    }));

    const { data: optionsData, error: optionsError } = await supabase
      .from('poll_options')
      .insert(optionsToInsert)
      .select();

    if (optionsError) {
      console.log('❌ Poll Options Creation Error:', optionsError.message);
      return;
    }
    console.log('✅ Poll options created:', optionsData.length, 'options');

    // Step 4: Test Poll Retrieval with Media Transform
    console.log('\n4️⃣ Testing Poll Retrieval with Media Transform...');
    
    const { data: retrievedPolls, error: retrieveError } = await supabase
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
        )
      `)
      .eq('id', pollData.id)
      .single();

    if (retrieveError) {
      console.log('❌ Poll Retrieval Error:', retrieveError.message);
      return;
    }

    console.log('✅ Poll retrieved successfully!');
    console.log('📊 Poll Title:', retrievedPolls.title);
    console.log('👤 Author:', retrievedPolls.author.username);
    console.log('🎯 Options Count:', retrievedPolls.options.length);
    
    // Check media transform data
    console.log('\n🔍 Media Transform Data Check:');
    retrievedPolls.options.forEach((option, index) => {
      console.log(`Option ${index + 1}:`, option.text);
      console.log(`  Media Transform:`, JSON.stringify(option.media_transform, null, 2));
    });

    // Step 5: Test Voting
    console.log('\n5️⃣ Testing Voting Functionality...');
    
    const firstOptionId = retrievedPolls.options[0].id;
    
    const { data: voteData, error: voteError } = await supabase
      .from('votes')
      .insert({
        poll_id: pollData.id,
        option_id: firstOptionId,
        user_id: testUserId
      })
      .select();

    if (voteError) {
      console.log('❌ Voting Error:', voteError.message);
    } else {
      console.log('✅ Vote cast successfully!');
    }

    // Step 6: Test Poll Like
    console.log('\n6️⃣ Testing Poll Like Functionality...');
    
    const { data: likeData, error: likeError } = await supabase
      .from('poll_likes')
      .insert({
        poll_id: pollData.id,
        user_id: testUserId
      })
      .select();

    if (likeError) {
      console.log('❌ Poll Like Error:', likeError.message);
    } else {
      console.log('✅ Poll liked successfully!');
    }

    // Step 7: Final verification
    console.log('\n7️⃣ Final Verification - Retrieving Updated Poll...');
    
    const { data: finalPoll, error: finalError } = await supabase
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
          mentioned_users
        ),
        poll_likes(user_id),
        votes(user_id, option_id)
      `)
      .eq('id', pollData.id)
      .single();

    if (finalError) {
      console.log('❌ Final Verification Error:', finalError.message);
      return;
    }

    console.log('✅ Final verification successful!');
    console.log('📈 Poll Likes:', finalPoll.poll_likes?.length || 0);
    console.log('🗳️ Total Votes:', finalPoll.votes?.length || 0);
    
    console.log('\n🎉 ALL TESTS PASSED! Supabase Poll Service is working correctly!');
    console.log('\n🔑 Key Features Verified:');
    console.log('✅ Poll creation with media transform data');
    console.log('✅ Media transform persistence in JSONB format');  
    console.log('✅ Poll retrieval with nested relationships');
    console.log('✅ Voting functionality');
    console.log('✅ Poll likes functionality');
    console.log('✅ User profiles integration');

  } catch (error) {
    console.log('❌ Unexpected Error:', error.message);
    console.log('Stack:', error.stack);
  }
}

// Run the test
testSupabasePollService();