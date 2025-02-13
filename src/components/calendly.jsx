import React from "react";

const CalendlyWidget = () => (
  <div
    className="calendly-inline-widget dark:bg-gray-900"
    style={{ minWidth: "320px", height: "630px" }}
  >
    <iframe
      title="Calendly Scheduling Widget"
      src="https://calendly.com/voliot"
      width="100%"
      height="105%"
      className="dark:border-none"
    ></iframe>
  </div>
);

export default CalendlyWidget;
