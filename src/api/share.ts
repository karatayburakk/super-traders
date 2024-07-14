import * as express from "express";
import { Request, Response, NextFunction } from "express";
import Share from "../db/models/share";

export default function api(): express.Router {
  const router: express.Router = express.Router();

  router.get("/", getAll);
  router.post("/", createShare);
  router.put("/:symbol", updateShare);
  router.delete("/:symbol", deleteShare);

  return router;
}

async function getAll(_req: Request, res: Response, next: NextFunction) {
  try {
    const shares = await Share.findAll();

    return res.status(200).json(shares);
  } catch (err) {
    return res.status(404).json(err);
  }
}

async function createShare(req: Request, res: Response, next: NextFunction) {
  try {
    const newShare = await Share.create({
      symbol: req.body.symbol,
      price: req.body.price,
    });

    return res.status(201).json(newShare);
  } catch (err) {
    return res.status(404).json(err);
  }
}

async function updateShare(req: Request, res: Response, next: NextFunction) {
  try {
    const share = await Share.findOne({
      where: {
        symbol: req.query.symbol,
      },
    });

    if (!share || req.body.price <= 0) {
      return res.status(404).json({
        name: "Bad Request",
      });
    }

    const updatedShare = await share.update({
      price: req.body.price,
    });

    return res.status(200).json(updatedShare);
  } catch (err) {
    return res.status(404).json(err);
  }
}

async function deleteShare(req: Request, res: Response, next: NextFunction) {
  try {
    const destroyed = await Share.destroy({
      where: {
        symbol: req.query.symbol,
      },
    });

    if (destroyed === 0) {
      return res.status(404).json({
        name: "Bad Request",
      });
    }

    return res.status(200).json("OK");
  } catch (err) {
    return res.status(404).json(err);
  }
}
