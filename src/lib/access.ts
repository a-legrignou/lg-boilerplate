import type { Access, FieldAccess } from "payload";

export type Role = "admin" | "editor" | "service";

type ReqUser = { role?: Role | null } | null | undefined;

const role = (user: ReqUser): Role | undefined => user?.role ?? undefined;

export const isAdmin: Access = ({ req }) =>
  role(req.user as ReqUser) === "admin";

export const isAdminOrEditor: Access = ({ req }) => {
  const r = role(req.user as ReqUser);
  return r === "admin" || r === "editor";
};

/**
 * Read access for content collections: anyone can read published, logged-in admins/editors see drafts too.
 */
export const readPublishedOrStaff: Access = ({ req }) => {
  const r = role(req.user as ReqUser);
  if (r === "admin" || r === "editor") return true;
  return { _status: { equals: "published" } };
};

export const isAdminField: FieldAccess = ({ req }) =>
  role(req.user as ReqUser) === "admin";

export const isStaff = (user: ReqUser): boolean => {
  const r = role(user);
  return r === "admin" || r === "editor";
};
