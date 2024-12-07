export const enums = [
  { gender: ['male', 'female'] },
  { adminRoles: ['SUPER_ADMIN', 'ADMIN', 'SUB_ADMIN'] },
  { activeStatus: ['PENDING', 'ACTIVE', 'INACTIVE'] },
];

export const regex = [
  { email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ },
  { mobile: /^[6-9]\d{9}$/ },
];

export const API_VERSION = '/api/v1/';

export const cookiesOption = {
  // expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
  httpOnly: true,
  secure: true,
  // sameSite: 'none',
};
