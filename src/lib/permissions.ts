/**
 * Role-Based Access Control (RBAC) for Spring Valley Church
 *
 * Roles: SUPER_ADMIN > ADMIN > EDITOR > CREATOR > CONTRIBUTOR > VIEWER
 */

export type Role = "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "CREATOR" | "CONTRIBUTOR" | "VIEWER";

// Role hierarchy — higher index = more permissions
const ROLE_HIERARCHY: Role[] = [
  "VIEWER",
  "CONTRIBUTOR",
  "CREATOR",
  "EDITOR",
  "ADMIN",
  "SUPER_ADMIN",
];

export function hasMinRole(userRole: Role, requiredRole: Role): boolean {
  return (
    ROLE_HIERARCHY.indexOf(userRole) >= ROLE_HIERARCHY.indexOf(requiredRole)
  );
}

// Permission definitions
type Permission =
  | "manage_users"
  | "manage_settings"
  | "manage_api_keys"
  | "create_posts"
  | "publish_posts"
  | "edit_any_post"
  | "delete_any_post"
  | "edit_own_post"
  | "review_posts"
  | "crosspost_social"
  | "manage_leadership"
  | "manage_ministries"
  | "upload_gallery"
  | "delete_gallery"
  | "view_messages"
  | "manage_media"
  | "send_whatsapp"
  | "view_analytics"
  | "view_audit_log"
  | "create_own_posts"
  | "submit_for_review";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SUPER_ADMIN: [
    "manage_users",
    "manage_settings",
    "manage_api_keys",
    "create_posts",
    "publish_posts",
    "edit_any_post",
    "delete_any_post",
    "edit_own_post",
    "review_posts",
    "crosspost_social",
    "manage_leadership",
    "manage_ministries",
    "upload_gallery",
    "delete_gallery",
    "view_messages",
    "manage_media",
    "send_whatsapp",
    "view_analytics",
    "view_audit_log",
    "create_own_posts",
    "submit_for_review",
  ],
  ADMIN: [
    "manage_settings",
    "create_posts",
    "publish_posts",
    "edit_any_post",
    "delete_any_post",
    "edit_own_post",
    "review_posts",
    "crosspost_social",
    "manage_leadership",
    "manage_ministries",
    "upload_gallery",
    "delete_gallery",
    "view_messages",
    "manage_media",
    "send_whatsapp",
    "view_analytics",
    "view_audit_log",
    "create_own_posts",
    "submit_for_review",
  ],
  EDITOR: [
    "create_posts",
    "publish_posts",
    "edit_any_post",
    "edit_own_post",
    "review_posts",
    "crosspost_social",
    "manage_ministries",
    "upload_gallery",
    "delete_gallery",
    "view_messages",
    "manage_media",
    "view_analytics",
    "create_own_posts",
    "submit_for_review",
  ],
  CREATOR: [
    "create_posts",
    "edit_own_post",
    "upload_gallery",
    "manage_media",
    "view_analytics",
    "create_own_posts",
    "submit_for_review",
  ],
  CONTRIBUTOR: [
    "create_own_posts",
    "edit_own_post",
    "submit_for_review",
  ],
  VIEWER: ["view_messages", "view_analytics"],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function getRoleLabel(role: Role): string {
  const labels: Record<Role, string> = {
    SUPER_ADMIN: "Super Admin",
    ADMIN: "Admin",
    EDITOR: "Editor",
    CREATOR: "Creator",
    CONTRIBUTOR: "Contributor",
    VIEWER: "Viewer",
  };
  return labels[role] || role;
}

export function getRoleColor(role: Role): string {
  const colors: Record<Role, string> = {
    SUPER_ADMIN: "bg-red-100 text-red-800",
    ADMIN: "bg-purple-100 text-purple-800",
    EDITOR: "bg-blue-100 text-blue-800",
    CREATOR: "bg-green-100 text-green-800",
    CONTRIBUTOR: "bg-teal-100 text-teal-800",
    VIEWER: "bg-gray-100 text-gray-800",
  };
  return colors[role] || "bg-gray-100 text-gray-800";
}
