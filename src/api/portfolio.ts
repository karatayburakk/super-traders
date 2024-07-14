import * as express from "express";
import { Response, NextFunction } from "express";
import Portfolio from "../db/models/portfolio";
import ShareInPortfolio from "../db/models/share-in-portfolio";
import { authMiddleware, RequestWithAuth } from "./auth-middleware";

export default function api(): express.Router {
  const router: express.Router = express.Router();

  router.use(authMiddleware());

  router.get("/", getPortfolio);
  router.post("/", createPortfolio);
  router.put("/", updatePortfolio);
  router.delete("/", deletePortfolio);

  return router;
}

async function getPortfolio(
  req: RequestWithAuth,
  res: Response,
  next: NextFunction
) {
  try {
    const portfolio = await Portfolio.findAll({
      where: {
        userId: req.userId,
      },
    });

    if (portfolio.length === 0) {
      return res.status(404).json({
        name: "There is no Portfolio for user",
      });
    }

    let sharesInportfolios: ShareInPortfolio[][];

    for (let i = 0; i < portfolio.length; i++) {
      const sharesInportfolio = await ShareInPortfolio.findAll({
        where: {
          portfolioId: portfolio[i].id,
        },
      });

      sharesInportfolios.push(sharesInportfolio);
    }

    return res.status(200).json({
      portfolio: portfolio,
      sharesInportfolios,
    });
  } catch (err) {
    return res.status(404).json(err);
  }
}

async function createPortfolio(
  req: RequestWithAuth,
  res: Response,
  next: NextFunction
) {
  try {
    const newPortfolio = await Portfolio.create({
      portfolioName: req.body.portfolioName,
      userId: req.userId,
    });

    return res.status(201).json(newPortfolio);
  } catch (err) {
    return res.status(404).json(err);
  }
}

async function updatePortfolio(
  req: RequestWithAuth,
  res: Response,
  next: NextFunction
) {
  try {
    const portfolio = await Portfolio.findOne({
      where: {
        userId: req.userId,
      },
    });

    const updatedProfile = await portfolio.update({
      portfolioName: req.body.portfolioName,
    });

    return res.status(200).json(updatedProfile);
  } catch (err) {
    return res.status(404).json(err);
  }
}

async function deletePortfolio(
  req: RequestWithAuth,
  res: Response,
  next: NextFunction
) {
  try {
    await Portfolio.destroy({
      where: {
        userId: req.userId,
      },
    });

    return res.status(200).json("OK");
  } catch (err) {
    return res.status(404).json(err);
  }
}
