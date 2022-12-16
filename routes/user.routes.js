const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");
const imageController = require('../controllers/image.controller');


// auth
router.post("/register", authController.signUp);
router.post("/login", authController.signIn);
router.get("/logout", authController.logout);

// user DB
router.get("/", userController.getAllUsers);
router.get("/:id", userController.userInfo);
// router.put("/bio/:id", userController.updateUserBio);
// router.put("/pseudo/:id", userController.updateUserPseudo);
// router.put("/email/:id", userController.updateUserEmail);
router.put("/update/:id", userController.updateUserInfo);
router.delete("/:id", userController.deleteUser);
router.patch("/follow/:id", userController.follow);
router.patch("/unfollow/:id", userController.unfollow);
router.patch("/remove/:id", userController.remove);


// upload
router.put("/image", imageController.imageProfil);

module.exports = router;
