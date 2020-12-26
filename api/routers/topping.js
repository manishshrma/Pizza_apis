const express = require("express");
const router = express.Router();
const passport = require("passport");
const Pizza = require("../../models/Pizza");
const Topping = require("../../models/Topping");

//////////Add topping (admin)//////////////////

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const addtopping = {};

    addtopping.toppingName = req.body.toppingName;
    addtopping.description = req.body.description;
    addtopping.toppingCost = req.body.toppingCost;

    const topping = new Topping(addtopping);

    try {
      const savedtopping = await topping.save();
      res.status(200).json({ success: true, message: `topping is added` });
    } catch (err) {
      res.status(400).json({ success: false, message: `${err}` });
    }
  }
);

////////////get available topping//////////////
router.get("/:topping_name", async (req, res) => {
  const topping = Pizza.findOne({ toppingName: req.params.topping_name });
  if (topping.result == null) {
    res
      .status(400)
      .json({
        success: false,
        message: `sorry! current ${req.params.topping_name} is not in the store`,
      });
  }

  res.status(200).json(`Here is your ${topping.toppingName} pizza`);
});

module.exports = router;
