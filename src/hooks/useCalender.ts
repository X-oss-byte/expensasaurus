import { Models, Query } from "appwrite";
import {
    add,
    eachDayOfInterval,
    endOfMonth,
    format,
    parse,
    startOfToday
} from "date-fns";

import { getAllLists } from "expensasaures/shared/services/query";
import { useAuthStore } from "expensasaures/shared/stores/useAuthStore";
import { Transaction } from "expensasaures/shared/types/transaction";
import { useState } from "react";
import { shallow } from "zustand/shallow";

export const useCalender = () => {
    let today = startOfToday();
    let [selectedDay, setSelectedDay] = useState(today);

    const { user } = useAuthStore((state) => ({ user: state.user }), shallow) as {
        user: Models.Session;
    };

    const startOfDay = new Date(
        selectedDay.getFullYear(),
        selectedDay.getMonth(),
        selectedDay.getDate()
    ).toISOString();

    const endOfDay = new Date(
        selectedDay.getFullYear(),
        selectedDay.getMonth(),
        selectedDay.getDate() + 1
    ).toISOString();

    const { data } = getAllLists<Transaction>(
        ["Expenses", user?.userId, selectedDay],
        [
            "6467f9811c14ca905ed5",
            "6467f98b8e8fe5ffa576",
            [
                Query.equal("userId", user?.userId),
                Query.lessThanEqual("date", endOfDay),
                Query.greaterThan("date", startOfDay),
            ],
        ],
        { enabled: !!user, staleTime: Infinity }
    );

    let [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
    let firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

    let days = eachDayOfInterval({
        start: firstDayCurrentMonth,
        end: endOfMonth(firstDayCurrentMonth),
    });

    const startOfThisMonth = new Date(
        parse(currentMonth, "MMM-yyyy", new Date()).getFullYear(),
        parse(currentMonth, "MMM-yyyy", new Date()).getMonth(),
        1
    ).toISOString();
    const endOfThisMonth = new Date(
        parse(currentMonth, "MMM-yyyy", new Date()).getFullYear(),
        parse(currentMonth, "MMM-yyyy", new Date()).getMonth() + 1,
        1
    ).toISOString();

    const { data: thisMonthExpenses } = getAllLists<Transaction>(
        ["Expenses", "Stats this month", user?.userId, startOfThisMonth, endOfThisMonth],
        [
            "6467f9811c14ca905ed5",
            "6467f98b8e8fe5ffa576",
            [
                Query.equal("userId", user?.userId),
                Query.lessThanEqual("date", endOfThisMonth),
                Query.greaterThan("date", startOfThisMonth),
                Query.orderAsc("date"),
            ],
        ],
        { enabled: !!user }
    );

    const previousMonth = () => {
        let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
        setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
    };

    const nextMonth = () => {
        let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
        setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
    };



    return {
        selectedDay,
        setSelectedDay,
        data,
        thisMonthExpenses,
        currentMonth,
        days,
        previousMonth,
        nextMonth,
        firstDayCurrentMonth
    }
}