import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export function stringToSlug(str: string) {
  str = str.replace(/^\s+|\s+$/g, '') // Trim leading/trailing spaces
  .replace(/\s+/g, '-')
  .toLowerCase();

  // Remove accents, swap ñ for n, etc
  const from = "àáãäâèéëêìíïîòóöôùúüûñç·/_,:;ÀÁÃÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛÑÇ";
  const to = "aaaaaeeeeiiiioooouuuunc------AAAAAEEEEIIIIOOOOUUUUNC------";

  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str.replace(/[^a-z0-9 -]/g, '') // Remove invalid characters
    .replace(/\s+/g, '-') // Collapse whitespace and replace by "-"
    .replace(/-+/g, '-'); // Collapse dashes

  return str;
}


export const truncateText = (str:string, maxLength:number = 20):string => {
  if (str.length > maxLength) {
    return str.slice(0, maxLength - 3) + "...";
  }
  return str;
}