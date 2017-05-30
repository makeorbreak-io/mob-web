export const linkedMessage = (message, link) => {
  return message.replace(/<link>(.*)<\/link>/g, `<a href="${link}">$1</a>`);
};
