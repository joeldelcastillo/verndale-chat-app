import React from "react";

type AlertType = "Success" | "Error" | "Warning";

type AlertProps = {
  type: AlertType;
  message: string;
  onClose: () => void;
};

const backgroundColors = {
  Success: "#22C55E",
  Error: "#EF4444",
  Warning: "#F97316",
};

const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  return (
    <div
      className="alert-box flex w-full rounded-lg flex-col max-w-[400px] transform items-start justify-start gap-4  bg-white transition delay-200 duration-500 ease-in-out"
      style={{ zIndex: "100" }}
    >
      <div className="flex w-full items-start justify-between p-3">
        <span className="font-Inter text-[13px] font-medium leading-tight text-black">
          {message}
        </span>
        <span
          className="cursor-pointer duration-300 hover:opacity-70"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>

        </span>
      </div>
      <div
        style={{
          backgroundColor: backgroundColors[type],
        }}
        className="flex h-4 w-full items-center justify-center rounded-b-lg"
      ></div>
    </div>
  );
};

export default Alert;