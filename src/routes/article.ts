
import { Router } from "express";
import { celebrate } from "celebrate";
import messageController from "../controllers/message";
import isAuthenticated from "../middleware/authorization";
import article from "../controllers/article";

const articleRouter = Router();

articleRouter.get("/all",article.getAll);
articleRouter.get("/one/:articleId",article.getOne)
articleRouter.get("/created-by",isAuthenticated,article.getAllCreated);
articleRouter.post("/post",isAuthenticated,article.post);
articleRouter.patch("/approve/:articleId",isAuthenticated,article.approve);
articleRouter.delete("/delete/:articleId",isAuthenticated,article.delete);
articleRouter.patch("/edit/:articleId",isAuthenticated,article.edit);

export default articleRouter;
