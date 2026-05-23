export const ROLES = ["Super Admin", "Admin", "Viewer", "None"] as const;
export type RoleType = typeof ROLES[number];

export interface UserPermissions {
  ringkasan: RoleType;
  map: RoleType;
  partners: RoleType;
  sales: RoleType;
  transactions: RoleType;
  products: RoleType;
  schedule: RoleType;
  access: RoleType;
}

export interface UserAccount {
  id: number;
  name: string;
  email: string;
  password?: string;
  permissions: UserPermissions;
}

export const DEFAULT_USER: UserAccount = {
  id: 1,
  name: "Admin Utama",
  email: "admin@gmgconsole.id",
  password: "password123",
  permissions: {
    ringkasan: "Super Admin",
    map: "Super Admin",
    partners: "Super Admin",
    sales: "Super Admin",
    transactions: "Super Admin",
    products: "Super Admin",
    schedule: "Super Admin",
    access: "Super Admin",
  }
};

export const MOCK_USERS: UserAccount[] = [
  DEFAULT_USER,
  {
    id: 2,
    name: "Siska Saraswati",
    email: "siska@workhub.com",
    password: "adminpassword",
    permissions: {
      ringkasan: "Admin",
      map: "Admin",
      partners: "Admin",
      sales: "Admin",
      transactions: "Admin",
      products: "Admin",
      schedule: "Admin",
      access: "None"
    }
  },
  {
    id: 3,
    name: "Agus Subarjo",
    email: "agus@workhub.com",
    password: "viewerpass",
    permissions: {
      ringkasan: "Viewer",
      map: "Viewer",
      partners: "None",
      sales: "None",
      transactions: "None",
      products: "Viewer",
      schedule: "None",
      access: "None"
    }
  }
];

export function getCurrentUser(): UserAccount {
  try {
    const saved = localStorage.getItem('currentUser');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return DEFAULT_USER;
}

export function setCurrentUser(user: UserAccount) {
  localStorage.setItem('currentUser', JSON.stringify(user));
  // force a simple reload to apply sidebar changes
  window.dispatchEvent(new Event("storage"));
}

export function hasAccess(featureAccess: RoleType) {
  return featureAccess !== "None";
}
