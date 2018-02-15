export const ordinal = (number) => {
  const str = number.toString();
  const lastDigit = str[str.length - 1];

  switch (lastDigit) {
    case "1":
      return `${number}st`;
    case "2":
      return `${number}nd`;
    case "3":
      return `${number}rd`;
    default:
      return `${number}th`;
  }
};
