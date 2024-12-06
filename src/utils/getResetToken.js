import crypto from 'crypto';
const getResetToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};
export default getResetToken;
