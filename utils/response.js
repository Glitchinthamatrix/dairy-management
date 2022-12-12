export function sendFileStream(res, path) {
  return new Promise((resolve, reject) => {
    res.sendFile(path, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
