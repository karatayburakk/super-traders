import * as express from "express";
import { Response, NextFunction } from "express";
import Share from "../db/models/share";
import Portfolio from "../db/models/portfolio";
import ShareInPortfolio from "../db/models/share-in-portfolio";
import { authMiddleware, RequestWithAuth } from "./auth-middleware";

export default function api(): express.Router {
  const router: express.Router = express.Router();

  router.use(authMiddleware());

  router.get("/", getShareInPortfolio);
  router.post("/buy-share", buyShare);
  router.post("/sell-share", sellShare);

  return router;
}

async function getShareInPortfolio(
  req: RequestWithAuth,
  res: Response,
  next: NextFunction
) {
  try {
    const portfolio = await Portfolio.findOne({
      where: {
        portfolioName: req.body.portfolioName,
      },
    });
    const shareInPortfolios = await ShareInPortfolio.findAll({
      where: {
        portfolioId: portfolio.id,
      },
    });

    return res.status(200).json(shareInPortfolios);
  } catch (err) {
    return res.status(404).json(err);
  }
}

async function buyShare(
  req: RequestWithAuth,
  res: Response,
  next: NextFunction
) {
  const symbol = req.body.symbol;
  const rateToBuy = Number(req.body.rateToBuy);
  try {
    const share = await Share.findOne({
      where: {
        symbol,
      },
    });

    if (!share) {
      return res.status(404).json({
        name: "Bad Request",
      });
    }

    const portfolio = await Portfolio.findOne({
      where: {
        portfolioName: req.body.portfolioName,
      },
    });

    if (!portfolio || share.rate + rateToBuy > 1.0) {
      return res.status(404).json({
        name: "Bad Request",
      });
    }

    const shareInPortfolio = await ShareInPortfolio.findOne({
      where: {
        shareId: share.id,
        portfolioId: portfolio.id,
      },
    });

    await share.update({
      rate: share.rate + rateToBuy,
    });

    if (!shareInPortfolio) {
      const newShareInPortfolio = await ShareInPortfolio.create({
        shareId: share.id,
        portfolioId: portfolio.id,
        shareSymbol: share.symbol,
        rate: rateToBuy,
        price: share.price,
        totalPrice: share.price * rateToBuy * 100,
      });

      return res.status(200).json(newShareInPortfolio);
    }

    const updatedShareInPortfolio = await shareInPortfolio.update({
      rate: shareInPortfolio.rate + rateToBuy,
      price: share.price,
      totalPrice: (shareInPortfolio.rate + rateToBuy) * 100 * share.price,
    });

    return res.status(200).json(updatedShareInPortfolio);
  } catch (err) {
    return res.status(404).json(err);
  }
}

async function sellShare(
  req: RequestWithAuth,
  res: Response,
  next: NextFunction
) {
  const symbol = req.body.symbol;
  const rateToSell = Number(req.body.rateToSell);

  try {
    console.log("you are here");
    console.log(rateToSell, symbol);
    const share = await Share.findOne({
      where: {
        symbol,
      },
    });
    if (!share) {
      return res.status(404).json({
        name: "Bad Request",
      });
    }
    const shareInPortfolio = await ShareInPortfolio.findOne({
      where: {
        shareId: share.id,
      },
    });

    console.log(shareInPortfolio);
    if (!shareInPortfolio) {
      return res.status(404).json({
        name: "Bad Request",
      });
    }

    if (shareInPortfolio.rate < rateToSell) {
      return res.status(404).json({
        name: "Bad Request",
      });
    }

    const updatedShareInPortfolio = await shareInPortfolio.update({
      rate: shareInPortfolio.rate - rateToSell,
      totalPrice: (shareInPortfolio.rate - rateToSell) * 100 * share.price,
    });

    return res.status(200).json(updatedShareInPortfolio);
  } catch (err) {
    return res.status(404).json(err);
  }
}
