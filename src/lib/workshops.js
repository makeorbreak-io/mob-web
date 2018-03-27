export function sortedWorkshops(workshops = []) {
  const order = {
    coffee     : 1,
    unreal     : 2,
    git        : 3,
    television : 4,
    elixir     : 5,
    blockchain : 6,
  };

  const regex = new RegExp(Object.keys(order).join("|"));

  return workshops
  .filter(w => regex.test(w.slug))
  .sort((a, b) => (order[a.slug] - order[b.slug]));
}

window.sortedWorkshops = sortedWorkshops;

export function openWorkshop() {
  const match = window.location.hash.match(/#workshop-(.*)/);
  return match ? match[1] : null;
}
