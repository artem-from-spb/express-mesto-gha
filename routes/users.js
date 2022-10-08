const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");

const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getUserMe,
} = require("../controllers/users");

router.get("/", getUsers);

router.get("/me", getUserMe);

router.get("/:userId", celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24),
  }),
}), getUserById);

router.patch("/me", celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);

router.patch("/me/avatar", celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/https?:\/\/(www\.)?[a-zA-Z\d\-.]{1,}\.[a-z]{1,6}([/a-z0-9\-._~:?#[\]@!$&'()*+,;=]*)/),
  }),
}), updateAvatar);

module.exports = router;
