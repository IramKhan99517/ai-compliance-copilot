"use client";

import { useMemo } from "react";

export default function ZatcaCalendar() {
  const dueDate = new Date("2026-09-30");

  const daysRemaining = useMemo(() => {
    const today = new Date();

    return Math.ceil(
      (dueDate.getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24)
    );
  }, []);

  const status =
    daysRemaining <= 3
      ? "Urgent"
      : daysRemaining <= 10
      ? "Upcoming"
      : "On Track";

  return (
    <div className="p-6 rounded-2xl shadow bg-white dark:bg-gray-800">

      <h2 className="text-xl font-semibold mb-4">
        🇸🇦 ZATCA Compliance Calendar
      </h2>

      <div className="space-y-3">

        <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700">
          <p>VAT Return Due Date</p>
          <p className="font-semibold">
            {dueDate.toDateString()}
          </p>
        </div>

        <div className="p-4 rounded-lg bg-blue-100 dark:bg-blue-900/20">
          <p>Days Remaining</p>
          <p className="font-semibold">
            {daysRemaining}
          </p>
        </div>

        <div
          className={`p-4 rounded-lg ${
            status === "Urgent"
              ? "bg-red-100"
              : status === "Upcoming"
              ? "bg-yellow-100"
              : "bg-green-100"
          }`}
        >
          <p>Status</p>
          <p className="font-semibold">{status}</p>
        </div>

      </div>
    </div>
  );
}
