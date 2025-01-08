import React from "react";
import { Layout, Image, Button } from "antd";

const { Header } = Layout;

const Navbar = ({ isAutoScroll, setIsAutoScroll }) => {
  return (
    <Header
      className="h-auto flex !justify-between !items-center py-1 bg-[whitesmoke]"
      style={{
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)"
      }}
    >
      {/* Left Logo */}
      <div>
        <img
          src="/jsw.png"
          className="!w-auto !h-20 p-1.5"
          alt="Company Logo"
        />
      </div>

      {/* Center Title */}
      <div className="">
        {" "}
        <div
          className="uppercase tracking-wide text-xl font-bold"
          style={{
            color: "#134399",
            flexGrow: 1,
            textAlign: "center"
          }}
        >
          DRI Dashboard
          <div>
            {" "}
            <Button
              type="primary"
              className="!text-xs mt-1"
              style={{
                backgroundColor: isAutoScroll ? "green" : "red",
                borderColor: isAutoScroll ? "green" : "red"
              }}
              onClick={() => setIsAutoScroll(!isAutoScroll)}
            >
              {isAutoScroll ? "Turn Off Auto-Scroll" : "Turn On Auto-Scroll"}
            </Button>
          </div>
        </div>
      </div>

      {/* Left Logo */}
      <div>
        <img
          src="/doclogo.png"
          className="!w-52 !h-30 object-contain"
          alt="Company Logo"
        />
      </div>
    </Header>
  );
};

export default Navbar;
