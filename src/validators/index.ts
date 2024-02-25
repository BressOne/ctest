import { Statuses } from "../types/common";

const mmYYYYRegex = /^(1[0-2]|0[1-9])-\d{4}$/;
const decimalRegex = /^\d+$/;

export const validateStatus = (value: any) =>
  Object.values(Statuses).some((allowed) => allowed === value);
export const validatePriority = (value: any) => decimalRegex.test(value);
export const validateDateStr = (value: any) => mmYYYYRegex.test(value);
