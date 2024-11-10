import { type ClassValue, clsx } from "clsx"
import moment, { Moment } from "moment"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function withInRange(date: Moment, startDate: Moment, endDate: Moment) {
  return date.isBetween(startDate, endDate, 'day', '[]');
}

export function excelDateToJSDate(serial: number) {
  // Excel's epoch starts from 1900-01-01
  const utc_days = Math.floor(serial - 25569);
  const milliseconds = utc_days * 24 * 60 * 60 * 1000;
  return moment(milliseconds);
}