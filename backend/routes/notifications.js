const express = require('express');
const router = express.Router();
const Notification = require('../models/notifications/Notification');

// Fetch notifications for a user
router.get('/:recipientType/:recipientId', async (req, res) => {
  const { recipientType, recipientId } = req.params;
  try {
    const notifications = await Notification.findAll({
      where: { recipientId: recipientId.toString(), recipientType },
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, data: notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Add a new notification
router.post('/', async (req, res) => {
  try {
    const { recipientId, recipientType, messageKey, requestId, action, isRead } = req.body;

    // Validate required fields
    if (!recipientId || !recipientType || !messageKey || !requestId || !action) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Create the notification
    const notification = await Notification.create({
      recipientId: recipientId.toString(),
      recipientType,
      messageKey,
      requestId,
      action,
      isRead: isRead !== undefined ? isRead : false, // Default isRead to false if not provided
    });

    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// Mark a notification as read
router.put('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    notification.isRead = true;
    await notification.save();
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete a specific notification
router.delete('/:id', async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    await notification.destroy();
    res.json({ success: true, message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Clear all notifications for a user
router.post('/delete', async (req, res) => {
  try {
      console.log('🔹 Incoming DELETE request to /api/notifications/delete');

      const { notificationIds } = req.body;
      console.log('📩 Received notificationIds:', notificationIds);

      if (!notificationIds || !Array.isArray(notificationIds) || notificationIds.length === 0) {
          console.log('❌ Invalid request: Missing or incorrect notificationIds');
          return res.status(400).json({ success: false, message: 'Invalid request. Provide an array of notification IDs.' });
      }

      const deletedCount = await Notification.destroy({
          where: { id: notificationIds }
      });

      console.log(`🗑️ Deleted ${deletedCount} notifications`);

      if (deletedCount === 0) {
          console.log('⚠️ No matching notifications found for deletion.');
          return res.status(404).json({ success: false, message: 'No notifications found to delete.' });
      }

      console.log('✅ Notifications deleted successfully!');
      
      // ✅ Explicitly return { success: true }
      return res.json({ success: true, message: 'Notifications deleted successfully.', deletedCount });

  } catch (error) {
      console.error('❌ Error deleting notifications:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});



module.exports = router;
