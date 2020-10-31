const srvUtil = (token) => {
  return Buffer.from(token.split(' ')[1], 'base64').toString();
};

module.exports = {
  decodeToken: srvUtil
};
