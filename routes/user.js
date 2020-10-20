const router = require("express").Router();
const auth = require("../middlewares/authApi");
const {
  getUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser
} = require("../controllers/userController");

/* GET All user listing. with role : admin ex : "auth.isAuthorized" */
router.get("/", auth.isAuth, getUsers);
/* GET user with id. must authenticated*/
router.get("/:id", auth.isAuth, getUser);
/* POST create a user. with role : admin */
router.post("/", auth.isAuth, createUser);
/* DELETE remove a user. with role : admin */
router.delete("/:id", auth.isAuth, deleteUser);
/* PUT update user data with id. must authenticated*/
router.put("/:id", auth.isAuth, updateUser);

module.exports = router;
