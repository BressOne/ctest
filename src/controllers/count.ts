import axios, { AxiosInstance } from "axios";
import { Request, Response } from "express";
import http from "http";

import { getStartOfTheMonth, getEndOfTheMonth } from "../utils";
import { Statuses } from "../types/common";
import {
  externalApiUrl,
  externalApiPaginationZeroIndex,
  axiosInstanceTimeoutMs,
} from "../constants";

type Filter = {
  priorityTreshold: number;
  startOfTheMonth: Date;
  endtOfTheMonth: Date;
  status: Statuses;
};

type RecursiveCounterParams = {
  accumulator: number;
  targetPage: number;
  axiosInstance: AxiosInstance;
  filter: Filter;
};

type Task = {
  task_id: string;
  task_name: string;
  timestamp: number;
  status: Statuses;
  priority: number;
};

type ApiResponse = {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: Task[];
};

const recursiveCounter = async ({
  accumulator,
  targetPage,
  axiosInstance,
  filter,
}: RecursiveCounterParams): Promise<number> => {
  let thisIterationCount = 0;

  const { priorityTreshold, startOfTheMonth, endtOfTheMonth, status } = filter;

  const {
    data: { data, page, total_pages: totalPages },
  } = await axiosInstance.get<ApiResponse>("", {
    params: { status, page: targetPage },
  });

  data.forEach((element) => {
    const timeStamp = new Date(element.timestamp);
    if (
      timeStamp > startOfTheMonth &&
      timeStamp < endtOfTheMonth &&
      element.priority > priorityTreshold
    ) {
      thisIterationCount++;
    }
  });

  if (page < totalPages) {
    return await recursiveCounter({
      accumulator: thisIterationCount + accumulator,
      targetPage: targetPage + 1,
      axiosInstance,
      filter,
    });
  } else {
    return thisIterationCount + accumulator;
  }
};

export const counterController = async (req: Request, res: Response) => {
  const axiosInstance: AxiosInstance = axios.create({
    baseURL: externalApiUrl,
    timeout: axiosInstanceTimeoutMs,
    httpAgent: new http.Agent({ keepAlive: true }),
  });

  const status = req.params.status;
  const { priority, dateStr } = req.query;
  const [month, year] = (dateStr as string)
    .split("-")
    .map((el) => Number.parseInt(el, 10));

  const startOfTheMonth = getStartOfTheMonth({ month, year });
  const endtOfTheMonth = getEndOfTheMonth({ month, year });

  const priorityTreshold = Number.parseInt(priority as string);

  const count = await recursiveCounter({
    accumulator: 0,
    targetPage: externalApiPaginationZeroIndex,
    axiosInstance,
    filter: {
      priorityTreshold,
      startOfTheMonth,
      endtOfTheMonth,
      status: status as Statuses,
    },
  });

  res.status(200).json({
    numTasks: count,
  });
};
