export const linkedMessage = (message, link) => {
  return message
    .replace("\n", "<br />")
    .replace(/<link>(.*)<\/link>/g, `<a href="${link}" target="_blank" rel="noopener noreferrer">$1</a>`);
};
