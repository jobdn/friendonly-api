const whitelist = [
  process.env.CLIENT_URL_1,
  process.env.CLIENT_URL_2,
  process.env.LOCAL_CLIENT_URL,
];

module.exports = {
  origin: function (origin, callback) {
    console.log("origin sended request: ", origin);
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
