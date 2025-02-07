// profileImages.ts
export enum ProfileImages {
  Image1 = "https://i.namu.wiki/i/g_KWbWLZvwPIarNr2apToYiutsBO8ousgVj3h-McRHmNr-A-6WNS-HDYkZLt6-dEut9KKiJeZSPyUM57FlmLsg.webp",
  Image2 = "https://i.namu.wiki/i/bYi9xO4BUA13TAW4BazW8vZF8k2Le_SQbmMokvY6Xi-uu6pbDiPvGILLthl2AYYrhc4c8hlTUBY_bivrO-MEwg.webp",
  Image3 = "https://i.namu.wiki/i/LYjCNMDiqrNNxRd1McVlMYHO9djCRwnAKRgfcadQappLbKxnASR7d7OJGkeJAlHMC37Wp4xiPz0wuq7J8BpYCQ.webp",
  Image4 = "https://i.namu.wiki/i/s3j02DGmtjpD6z2f5XjzQwTKY6alOhMZe_CKQQzzpB0zr317PLzqDY8luvbzHABudJO8FAH69EqSjEESuT62Og.webp",
  Image5 = "https://i.namu.wiki/i/gEPVn6l87ysQuz8rs3sqI_ChOZPJuwq3XguGiM7gyuDIHZUBZaU0om03XQ4HalmIFrFNfQaA3ZzQ2WvixU3X8A.webp",
  Image6 = "https://i.namu.wiki/i/Mmn329Kk-bEN6x8d00tjFF6Q-XUg7yGCCFoMtMF1OC-r3FdyMFPz7yKIkehTu43_ZLLqM3B4iH0Z6kT59Et0NQ.webp",
}

export function getRandomProfileImage(): string {
  const images = Object.values(ProfileImages);
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
}
