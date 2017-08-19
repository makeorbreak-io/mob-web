import { isEmpty } from "lodash";

export function sortedWorkshops(workshops = {}) {
  return isEmpty(workshops)
  ? []
  : [
      workshops["unity3d-gamedev"],
      workshops["3d-printing"],
      workshops["iot"],
      workshops["devops"],
      workshops["design"],
      workshops["hardware-maintenance"],
    ];
}

export function openWorkshop() {
  const match = window.location.hash.match(/#workshop-(.*)/);
  return match ? match[1] : null;
}
