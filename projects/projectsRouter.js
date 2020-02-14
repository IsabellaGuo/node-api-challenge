const express = require("express");

const Projects = require("../data/helpers/projectModel.js");

const router = express.Router();

//GET all projects
router.get("/", (req, res) => {
  Projects.get()
    .then(projects => {
      res.status(200).json(projects);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "The projects information could not be found" });
    });
});

//GET project by id
router.get("/:id", (req, res) => {
  const { id } = req.params;
  Projects.get(id)
    .then(projects => {
        if (id) {
            res.status(200).json(projects);
        } else {
            res.status(404).json({
                error: "No project with that ID"
              });
        }
      
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ error: "The project information could not be found" });
    });
});

//GET all actions for specified project id
router.get("/:id/actions", (req, res) => {
    const project_id = req.params.id;
  
    Projects
      .getProjectActions(project_id)
      .then(actions => {
        if (project_id) {
          res.status(200).json(actions);
        } else {
          res.status(404).json({
            message: "The project with the specific ID does not exist"
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

//POST new project
router.post("/", (req, res) => {
    const newProject = req.body;
  
    Projects
      .insert(newProject)
      .then(project => {
        if (newProject.name || newProject.description) {
          res.status(201).json(project);
        } else {
          res.status(400).json({
            errorMessage: "Please provide name and description for new a project"
          });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: "There was an error while saving the project"
        });
      });
  });

//PUT updates for specified project
router.put("/:id", (req, res) => {
    const id = req.params.id;
    const body = req.body;
  
    Projects
      .update(id, body)
      .then(updatedP => {
        if (!id) {
          res.status(404).json({
            message: "The project with the specific ID does not exist"
          });
        } else if (!updatedP.name || !updatedP.description) {
          res.status(400).json({
            message: "Please provide name and description for updated project"
          });
        } else {
          res.status(200).json({ updatedP });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: "The project information could not be updated"
        });
      });
  });

//DELETE specified project
router.delete("/:id", (req, res) => {
    const id = req.params.id;
  
    Projects
      .remove(id)
      .then(deletedP => {
        if (!id) {
          res.status(404).json({
            message: "The project with the specific ID does not exist"
          });
        } else {
          res.status(200).json({ deletedP });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: "The project could not be removed"
        });
      });
  });

//custom middleware
function validateProject(req, res, next) {
    const { name, description } = req.body;
    if (!name || !description) {
      res.status(400).json({ error: "Fields required!" });
    } else if ((typeof name !== "string", typeof description !== "string")) {
      res.status(400).json({ error: "Invalid field type." });
    } else {
      next();
    }
  }
  
  function validateProjectId (req, res, next) {
    const { id: project_id } = req.params;
    const { name, description } = req.body;
    if (!req.body) {
      res.status(400).json({ error: "Post requires body" });
    } else if (!name || !description) {
      res.status(400).json({ error: "Action requires text" });
    } else {
      req.body = { project_id, name, description };
      next();
    }
  }







module.exports = router;