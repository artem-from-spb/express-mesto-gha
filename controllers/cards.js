const Card = require("../models/card");

const createCard = (req, res) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  Card.create({ name, link, owner: ownerId }).then((card) => {
    res.send({ data: card });
  });
};

const getCards = (req, res) => {
  Card.find({}).then((list) => {
    res.send(list);
  });
};

const deleteCard = (req, res) => {
  Card.findOneAndRemove(req.params.id).then((cards) => {
    res.send({ data: cards });
  });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
};
