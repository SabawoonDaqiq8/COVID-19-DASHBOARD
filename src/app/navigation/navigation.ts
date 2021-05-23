import { FuseNavigation } from "@fuse/types";

export const navigation: FuseNavigation[] = [
    {
        id: "applications",
        title: "Applications",
        translate: "NAV.APPLICATIONS",
        type: "group",
        children: [
            {
                id: "covid-19",
                title: "COVID-19",
                translate: "NAV.COVID",
                type: "collapsable",
                icon: "healing",
                children: [
                    {
                        id: "dashboard",
                        title: "Dashboard",
                        translate: "NAV.DASHBOARD",
                        type: "item",
                        url: "/covid-19/dashboard",
                    },
                    {
                        id: "table",
                        title: "Table",
                        translate: "NAV.TABLE",
                        type: "item",
                        url: "/covid-19/table",
                    },
                ],
            },
        ],
    },
];
