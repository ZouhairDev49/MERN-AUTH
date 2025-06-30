// import jwt from "jsonwebtoken";

// const userAuth = (req, res, next) => {
//     const { token } = req.cookies;
//     if (!token) {
//         return res.json({ success: false, message: "Unauthorized" });
//     }
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         if (decoded.id) {
//             req.body.userId = decoded.id;
//             return next();
//         }else {
//             return res.json({ success: false, message: "Unauthorized login again" });
//         }
//     } catch (error) {
//         return res.json({ success: false, message: "Invalid token" });
//     }

// }

// export default userAuth;

import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.json({ success: false, message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.id) {
      req.userId = decoded.id; // Attach userId to req
      return next();
    } else {
      return res.json({ success: false, message: "Unauthorized, login again" });
    }
  } catch (error) {
    return res.json({ success: false, message: "Invalid token" });
  }
};

export default userAuth;