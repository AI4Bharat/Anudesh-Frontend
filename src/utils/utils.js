const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
export const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  
export function snakeToTitleCase(str) {
  return str.split("_").map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(" ");
}