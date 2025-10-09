const { getUserById, removeUserById } = require('../models/userModel');

const getUserProfile = async (req, res) => {
  console.log('📥 [GET] /api/user/profile');
  console.log('🔐 req.user:', req.user);

  const userId = req.user?.id;
  if (!userId) {
    console.warn('⚠️ No user ID found in token');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    console.log(`🔍 Fetching user with ID: ${userId}`);
    const user = await getUserById(userId);

    if (!user) {
      console.warn(`❌ No user found for ID: ${userId}`);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('✅ User found:', user);
    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (err) {
    console.error('❌ Failed to fetch profile:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

const deleteUser = async (req, res) => {
  console.log('📥 [DELETE] /api/user/delete');
  console.log('🔐 req.user:', req.user);

  const userId = req.user?.id;
  if (!userId) {
    console.warn('⚠️ No user ID found in token');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    console.log(`🗑️ Deleting user with ID: ${userId}`);
    await removeUserById(userId);
    console.log('✅ User deleted successfully');
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error('❌ Failed to delete account:', err);
    res.status(500).json({ error: 'Failed to delete account' });
  }
};

module.exports = { getUserProfile, deleteUser };
