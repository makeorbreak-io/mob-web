import prizeSwitch from "assets/images/prize-switch.png";
import prizeMonitor from "assets/images/prize-monitor.png";
import prizeHeadphones from "assets/images/prize-headphones.png";

import aiPrize1st from "assets/images/ai-prize-1st.png";
import aiPrize2nd from "assets/images/ai-prize-2nd.png";
import aiPrize3rd from "assets/images/ai-prize-3rd.png";

export const HACKATHON_PRIZES = [
  { title: "Fun", subtitle: "Nintendo Switch", description: "Play your favorite games anywhere and have some fun.", image: prizeSwitch },
  { title: "Useful", subtitle: "Dell Monitor U2515H", description: "Great for coding and design, with accurate colors and QHD resolution.", image: prizeMonitor },
  { title: "Creative", subtitle: "Bose QuietComfort 35", description: "Turn the world off and let your creative juices flow.", image: prizeHeadphones },
];

export const AI_COMP_PRIZES = [
  { title: "1st Place", subtitle: "Asus Tinker Board 2GB\n2.5\" 1Tb HDD Seagate Backup Plus Slim\nUE BOOM 2", image: aiPrize1st },
  { title: "2nd Place", subtitle: "Asus Tinker Board 2GB\n2.5\" 1Tb HDD Seagate Backup Plus Slim", image: aiPrize2nd },
  { title: "3rd Place", subtitle: "Asus Tinker Board 2GB", image: aiPrize3rd },
];
