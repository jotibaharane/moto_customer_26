import React, { memo, useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Bell, BellRing, Truck, X } from 'lucide-react-native';
import SocketService from '@socket/SocketService';

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  createdAt: Date;
  read: boolean;
};

type SocketNotification = {
  id?: string;
  title?: string;
  message?: string;
  body?: string;
  createdAt?: string;
};

const NOTIFICATION_EVENT = 'notification';

const NotificationBell = () => {
  const [visible, setVisible] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const unreadCount = notifications.filter(item => !item.read).length;

  useEffect(() => {
    const socket = SocketService.getSocket();

    if (!socket) {
      console.warn('Notification socket is not available');
      return;
    }

    const handleNotification = (data: SocketNotification) => {
      const newNotification: NotificationItem = {
        id: data.id || `${Date.now()}-${Math.random()}`,
        title: data.title || 'New Notification',
        message:
          data.message ||
          data.body ||
          'You have received a new notification.',
        createdAt: data.createdAt
          ? new Date(data.createdAt)
          : new Date(),
        read: false,
      };

      setNotifications(previous => [
        newNotification,
        ...previous,
      ]);

      // Keep the modal closed until the user taps the bell.
    };

    socket.on(NOTIFICATION_EVENT, handleNotification);

    return () => {
      socket.off(NOTIFICATION_EVENT, handleNotification);
    };
  }, []);

  const openNotifications = useCallback(() => {
    setVisible(true);

    // Mark notifications as read when opening the list.
    setNotifications(previous =>
      previous.map(item => ({
        ...item,
        read: true,
      })),
    );
  }, []);

  const closeNotifications = useCallback(() => {
    setVisible(false);
  }, []);

  const renderItem = ({ item }: { item: NotificationItem }) => (
    <View style={styles.notificationItem}>
      <View style={styles.iconContainer}>
        <Truck size={21} color="#2563EB" />
      </View>

      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>
          {item.title}
        </Text>

        <Text style={styles.notificationMessage}>
          {item.message}
        </Text>

        <Text style={styles.timeText}>
          {item.createdAt.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>

      {!item.read && <View style={styles.unreadDot} />}
    </View>
  );

  return (
    <>
      {/* Notification Bell */}
      <TouchableOpacity
        style={styles.bellButton}
        activeOpacity={0.8}
        onPress={openNotifications}
        accessibilityRole="button"
        accessibilityLabel={`Notifications, ${unreadCount} unread`}
      >
        <Bell
          size={20}
          color="#111111"
          strokeWidth={2.2}
        />

        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Notification Modal */}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={closeNotifications}
      >
        <Pressable
          style={styles.overlay}
          onPress={closeNotifications}
        >
          <Pressable
            style={styles.modalContainer}
            onPress={event => event.stopPropagation()}
          >
            {/* Header */}
            <View style={styles.header}>
              <View>
                <Text style={styles.headerTitle}>
                  Notifications
                </Text>

                <Text style={styles.headerSubtitle}>
                  Your latest booking updates
                </Text>
              </View>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeNotifications}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Close notifications"
              >
                <X size={21} color="#333333" />
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            {/* Notification List */}
            {notifications.length > 0 ? (
              <FlatList
                data={notifications}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <BellRing size={42} color="#A0A0A0" />

                <Text style={styles.emptyTitle}>
                  No notifications yet
                </Text>

                <Text style={styles.emptyMessage}>
                  Your booking updates will appear here.
                </Text>
              </View>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  // Bell button matching the screenshot
  bellButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    zIndex: 20,
  },

  // Red unread-count badge
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: '#FF2525',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },

  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    lineHeight: 12,
  },

  // Modal overlay
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 90,
    paddingHorizontal: 16,
  },

  modalContainer: {
    width: '100%',
    maxHeight: '75%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
  },

  headerTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#171717',
  },

  headerSubtitle: {
    fontSize: 12,
    color: '#888888',
    marginTop: 4,
  },

  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
  },

  listContent: {
    paddingHorizontal: 16,
  },

  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  notificationContent: {
    flex: 1,
  },

  notificationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222222',
  },

  notificationMessage: {
    fontSize: 13,
    color: '#666666',
    marginTop: 5,
    lineHeight: 19,
  },

  timeText: {
    fontSize: 11,
    color: '#999999',
    marginTop: 7,
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
    marginLeft: 8,
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 45,
    paddingHorizontal: 20,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginTop: 12,
  },

  emptyMessage: {
    fontSize: 13,
    color: '#888888',
    marginTop: 6,
    textAlign: 'center',
  },
});

export default memo(NotificationBell);
