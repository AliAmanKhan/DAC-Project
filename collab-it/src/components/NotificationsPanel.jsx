import { useState, useEffect } from "react";
import { Bell, Check, X, Loader } from "lucide-react";
import { collabService } from "../services/collabService";

export default function NotificationsPanel({ userId, isOpen, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    if (isOpen && userId) {
      fetchNotifications();
    }
  }, [isOpen, userId]);

  const fetchNotifications = async () => {
    setLoading(true);
    setError("");

    try {
      console.log("Fetching notifications for userId:", userId);
      const data = await collabService.getNotificationsForPitchOwner(userId);
      console.log("Notifications received:", data);
      setNotifications(data || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError(err.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (notificationId, requestId) => {
    setActionLoading((prev) => ({ ...prev, [requestId]: "accepting" }));

    try {
      await collabService.actOnRequest(requestId, true);
      await collabService.markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          n.notificationId === notificationId ? { ...n, status: "READ" } : n
        )
      );
    } catch (err) {
      console.error("Error accepting request:", err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [requestId]: null }));
    }
  };

  const handleReject = async (notificationId, requestId) => {
    setActionLoading((prev) => ({ ...prev, [requestId]: "rejecting" }));

    try {
      await collabService.actOnRequest(requestId, false);
      await collabService.markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          n.notificationId === notificationId ? { ...n, status: "READ" } : n
        )
      );
    } catch (err) {
      console.error("Error rejecting request:", err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [requestId]: null }));
    }
  };

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => n.status === "UNREAD").length;

  return (
    <div className="fixed right-4 top-20 w-96 bg-gradient-to-br from-card via-slate-900 to-card border border-border rounded-lg shadow-2xl z-40 max-h-96 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 p-4 border-b border-border/50 bg-gradient-to-r from-slate-800 to-slate-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          <h3 className="font-bold">Collaboration Requests</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-1 bg-primary text-white text-xs rounded-full font-bold">
              {unreadCount}
            </span>
          )}
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader className="w-5 h-5 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-sm">
            {error}
          </div>
        )}

        {!loading && notifications.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No collaboration requests</p>
          </div>
        )}

        {!loading && notifications.length > 0 && (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.notificationId}
                className={`p-4 rounded-lg border ${
                  notification.status === "UNREAD"
                    ? "bg-primary/5 border-primary/20"
                    : "bg-background border-border"
                }`}
              >
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    User #{notification.requesterUserId} wants to join
                  </p>
                  {notification.message && (
                    <p className="text-sm italic text-foreground">
                      "{notification.message}"
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Pitch ID: {notification.pitchId}
                  </p>
                </div>

                {notification.status === "UNREAD" && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() =>
                        handleAccept(
                          notification.notificationId,
                          notification.collaborationRequestId
                        )
                      }
                      disabled={actionLoading[notification.collaborationRequestId]}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-500/20 text-green-500 rounded hover:bg-green-500/30 transition text-sm font-medium disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      {actionLoading[notification.collaborationRequestId] === "accepting"
                        ? "Accepting..."
                        : "Accept"}
                    </button>
                    <button
                      onClick={() =>
                        handleReject(
                          notification.notificationId,
                          notification.collaborationRequestId
                        )
                      }
                      disabled={actionLoading[notification.collaborationRequestId]}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-500/20 text-red-500 rounded hover:bg-red-500/30 transition text-sm font-medium disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                      {actionLoading[notification.collaborationRequestId] === "rejecting"
                        ? "Rejecting..."
                        : "Reject"}
                    </button>
                  </div>
                )}

                {notification.status === "READ" && (
                  <div className="mt-3 text-xs text-muted-foreground">
                    ✓ Already processed
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
