export const enums = [
  { gender: ['male', 'female'] },
  { adminRoles: ['SUPER_ADMIN', 'ADMIN', 'SUB_ADMIN'] },
  { activeStatus: ['PENDING', 'ACTIVE', 'INACTIVE'] },
];

export const regex = [
  { email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ },
  { mobile: /^[6-9]\d{9}$/ },
];
