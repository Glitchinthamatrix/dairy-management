import crypto from "crypto";
import fs from "fs";
import path from "path";

const SESSION_FILE_PATH = path.join(process.cwd(), "sessions.json");

function getSessions() {
  return new Promise((resolve, reject) => {
    fs.readFile(SESSION_FILE_PATH, "utf-8", (err, data) => {
      if (err) {
        reject({ message: "can not read sessions file" });
      } else {
        const sessions = JSON.parse(data);
        resolve(sessions);
      }
    });
  });
}

async function getSession(token) {
  const sessions = await getSessions();
  return sessions[token];
}

function addSession(token, user) {
  return new Promise(async (resolve, reject) => {
    const sessions = await getSessions();
    sessions[token] = { startTime: Date.now(), user: user };
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(sessions), (err) => {
      if (err) {
        reject({ message: "cannot write session to session file" });
      } else {
        resolve();
      }
    });
  });
}

function removeSession(token) {
  return new Promise(async (resolve, reject) => {
    const sessions = await getSessions();
    delete sessions[token];
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(sessions), (err) => {
      if (err) {
        reject({ message: "cannot write session to session file" });
      } else {
        resolve();
      }
    });
  });
}

function isSessionValid(token) {
  return new Promise(async (resolve, reject) => {
    const session = await getSession(token);
    resolve(session ? true : false);
  });
}

async function sessionDeletionMiddleware(req, res) {
  try {
    const token = req.headers["authorization"];
    if (!token) {
      res.status(401).json({});
      return;
    }
    await removeSession(token);
    res.status(200).json({});
  } catch (e) {
    res.status(500).json({});
  }
}

async function sessionCreationMiddleware(req, res) {
  try {
    const token = crypto.randomBytes(15).toString("hex");
    const user = res.locals.user;
    const userSessionData = {
      id: user.id,
      email: user.email,
      name: user.name,
      isAnAdmin: user.isAnAdmin,
      isASeller: user.isASeller,
      picture: user.picture,
    };
    if (!user.isASeller && !user.isAnAdmin) {
      userSessionData.wishlist = user.wishlist;
      userSessionData.cart = user.cart;
      userSessionData.deliveryAddress = user.shippingAddress;
    }
    await addSession(token, userSessionData);
    res.status(200).json({ authToken: token });
  } catch (e) {
    res.status(500).json({});
  }
}
export default {
  addSession,
  getSession,
  isSessionValid,
  removeSession,
  sessionDeletionMiddleware,
  sessionCreationMiddleware,
};
