const express = require("express");

const Actions = require("../data/helpers/actionModel.js");
const Projects = require("../data/helpers/projectModel.js");

const router = express.Router();

//GET all actions
router.get("/", (req, res) => {
  Actions.get()
    .then(actions => {
      res.status(200).json(actions);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "The actions information could not be found" });
    });
});

//GET actions by id
router.get("/:id", validateAction, (req, res) => {
  const { id } = req.params;

  Actions.get(id)
    .then(actions => {
        if (id) {
            res.status(200).json(actions);
        } else {
            res.status(404).json({
                error: "No action with that ID"
              }); 
        }
      
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: "The actions information could not be found"
        });
    });
});

//POST new action
router.post("/:id/actions", validateAction, (req, res) => {
    const body = req.body;
    const id = req.params.id;
    const newAction = { ...body, project_id: id };
  
    Actions
      .insert(newAction)
      .then(action => {
          res.status(200).json({ action })
      })
      .catch(err => {
        res.status(500).json({
          errorMessage: `There was an error while saving the action ${err.res}`
        });
      });
  });

//PUT updates 
router.put("/:id", (req, res) => {
    const id = req.params.id;
    const body = req.body;
  
    Actions
      .update(id, body)
      .then(updatedA => {
        if (!id) {
          res.status(404).json({
            message: "The action with the specific ID does not exist"
          });
        } else if (!updatedA.description || !updatedA.notes) {
          res.status(400).json({
            message: "Please provide description and notes for updated actions"
          });
        } else {
          res.status(200).json({ updatedA });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: "The action information could not be updated"
        });
      });
  });

//DELETE specified action
router.delete("/:id", (req, res) => {
    const id = req.params.id;
  
    Actions
      .remove(id)
      .then(deletedA => {
        if (!id) {
          res.status(404).json({
            message: "The action with the specific ID does not exist"
          });
        } else {
          res.status(200).json({ deletedA });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: "The action could not be removed"
        });
      });
  });

//custom middleware

function validateAction(req, res, next) {
    if (!req.body) {
      res.status(400).json({
        message: "missing data"
      });
    } else if (!req.body.description || !req.body.notes) {
      res.status(400).json({
        message: "missing fields"
      });
    } else {
      next();
    }
  }



module.exports = router;