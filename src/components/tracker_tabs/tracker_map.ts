import { IconType } from "react-icons";
import { FiHome, FiBarChart2, FiClock, FiMoreHorizontal } from "react-icons/fi";

import { HistoryTab } from "./history/history";
import { MoreTab } from "./more/more";
import { StatsTab } from "./stats/stats";
import { TodayTab } from "./today/today";

type TrackerTabConfig = {
    component: React.FC;
    icon: IconType;
    label: string;
};

export const TrackerTabMap: Record<string, TrackerTabConfig> = {
    today: {
        component: TodayTab,
        icon: FiHome,
        label: "Today",
    },
    stats: {
        component: StatsTab,
        icon: FiBarChart2,
        label: "Stats",
    },
    history: {
        component: HistoryTab,
        icon: FiClock,
        label: "History",
    },
    more: {
        component: MoreTab,
        icon: FiMoreHorizontal,
        label: "More",
    },
};
