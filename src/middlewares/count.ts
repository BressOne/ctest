import { NextFunction, Request, Response } from "express";

import {
  validateStatus,
  validatePriority,
  validateDateStr,
} from "../validators";
import { Statuses } from "../types/common";

const counterValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const status = req.params.status;
  const { priority, dateStr } = req.query;

  if (!status || !validateStatus(status)) {
    res
      .status(400)
      .send(
        `Unrecognized or missing status value. Can be one of the folowing: ${Object.values(Statuses).join(", ")}.`,
      );
    return;
  }
  if (!priority || !validatePriority(priority)) {
    res
      .status(400)
      .send(
        `Unrecognized or missing priority value. Should be positive decimal integer.`,
      );
    return;
  }
  if (!dateStr || !validateDateStr(dateStr)) {
    res
      .status(400)
      .send(
        `Unrecognized or missing dateStr value. Should proper MM-YYYY format.`,
      );
    return;
  }
  next();
};

module.exports = { counterValidator };
