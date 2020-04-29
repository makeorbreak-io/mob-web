import React from "react";
import { BrowserRouter } from "react-router-dom";

import { Card } from "components/2020/uikit";

export default { title: "Card" };

const mockData = {
    date: new Date(),
    title: "This is a somewhat long title that can take up to two lines",
    speaker: { name: "Speaker Speakerson", job: "Teacher, Greendale" },
    summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
};

export const Active = () => (
    <BrowserRouter>
        <Card data={mockData} isActive />
    </BrowserRouter>
);

export const Inactive = () => (
    <BrowserRouter>
        <Card data={mockData} />
    </BrowserRouter>
);

export const Big = () => (
    <BrowserRouter>
      <Card data={mockData} big isActive />
    </BrowserRouter>
);