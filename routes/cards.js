const router = require("express").Router();
const {
  createCard,
  getCards,
  deleteCard,
  setLike,
  removeLike,
} = require("../controllers/cards");

router.get("/", getCards);
router.post("/", createCard);
router.delete("/:cardId", deleteCard);
router.put("/:cardId/likes", setLike);
router.delete("/:cardId/likes", removeLike);

module.exports = router;
