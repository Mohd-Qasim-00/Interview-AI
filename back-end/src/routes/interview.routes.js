const express = require('express');

const interviewRouter = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');

const upload = require('../middlewares/file.middleware');

const interviewController = require('../controller/interview.controller');


interviewRouter.post("/", authMiddleware.authenticateToken, upload.single("resume"), interviewController.generteInterviewReport);

interviewRouter.get("/latest", authMiddleware.authenticateToken, interviewController.getMyLatestReport);

interviewRouter.get("/report/:interviewId", authMiddleware.authenticateToken, interviewController.getLatestReport);

interviewRouter.get("/", authMiddleware.authenticateToken, interviewController.AllInterviewReports);

module.exports = interviewRouter;