import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Card,
  Typography,
  Row,
  Col,
  Tag,
  Spin,
  Divider,
  Image,
  Layout,
  message
} from "antd";
import { SafetyCertificateTwoTone } from "@ant-design/icons";
import "./App.css";
import { desc } from "./utils/utils";
import Navbar from "./components/Navbar";

const { Content } = Layout;
const { Title, Text } = Typography;

const App = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAutoScroll, setIsAutoScroll] = useState(true); // Default: Auto-Scroll ON
  const timeoutRef = useRef(null);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    const handleTripleClick = () => {
      setClickCount((prev) => prev + 1);

      setTimeout(() => {
        setClickCount(0); // Reset after short delay
      }, 1000);

      if (clickCount >= 2) {
        setIsAutoScroll((prev) => !prev);
        message.info(`Auto-Scroll ${isAutoScroll ? "Disabled" : "Enabled"}`);
        setClickCount(0); // Reset counter
      }
    };

    document.addEventListener("click", handleTripleClick);
    return () => document.removeEventListener("click", handleTripleClick);
  }, [clickCount, isAutoScroll]);

  // Auto Scroll Effect with Toggle
  useEffect(() => {
    if (!isAutoScroll) return; // If disabled, do nothing

    let scrollInterval;
    let scrollStep = 2; // Adjust speed (higher = faster)
    let scrollDelay = 50; // Delay between each scroll step (ms)

    const startAutoScroll = () => {
      scrollInterval = setInterval(() => {
        if (
          window.innerHeight + window.scrollY >=
          document.body.scrollHeight - 10
        ) {
          window.scrollTo({ top: 0, behavior: "auto" }); // Instantly go to the top
        } else {
          window.scrollBy({ top: scrollStep, behavior: "smooth" });
        }
      }, scrollDelay);
    };

    startAutoScroll();

    return () => clearInterval(scrollInterval); // Cleanup on unmount
  }, [isAutoScroll]); // Runs when `isAutoScroll` changes

  useEffect(() => {
    const fetchData = () => {
      axios
        .get("http://localhost:8000/sendDRIData")
        .then((response) => {
          if (response.data.status === "success") {
            setPlayers(response.data.data);
            message.success("Data Refresh Success");
            console.log(
              "✅ Data fetched successfully at:",
              new Date().toLocaleTimeString()
            );
          }
        })
        .catch((error) => {
          console.error("❌ Error fetching player data:", error);
          message.error("Failed to refresh data");
        })
        .finally(() => setLoading(false));
    };

    fetchData(); // Initial Call

    // Auto-fetch every 2 minutes
    const intervalId = setInterval(fetchData, 2 * 60 * 1000);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const shiftCounts = {
    A: players.filter((player) => player.shift === "A").length,
    B: players.filter((player) => player.shift === "B").length,
    C: players.filter((player) => player.shift === "C").length,
    G: players.filter((player) => player.shift === "G").length
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Navbar isAutoScroll={isAutoScroll} setIsAutoScroll={setIsAutoScroll} />
      <Content
        className="stat-container flex w-screen  flex-col items-center"
        style={{
          background: "linear-gradient(to bottom, #000428, #004e92)",
          padding: "15px"
        }}
      >
        <Card
          className="stat-card"
          bordered={false}
          style={{
            padding: 15,
            borderRadius: 20,
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
            width: "100%",
            background: "#1b1b3a",
            color: "#fff"
          }}
        >
          {/* HEADER WITH SAFETY ICON */}
          <Row
            justify="space-between"
            align="middle"
            style={{ marginBottom: 20 }}
          >
            <Col span={9}>
              <h1
                className="title uppercase !text-2xl pb-2"
                style={{ color: "#FFD700", fontWeight: "bold" }}
              >
                DRI Rakshak
              </h1>
              <Text
                style={{ color: "#ddd" }}
                className="!text-xs uppercase font-semibold"
              >
                <div className="flex gap-5 text-sm">
                  Date: {players[0]?.date || "N/A"} <span>||</span> Total
                  Employees: {players.length} <span>||</span>
                  {shiftCounts.A > 0 && (
                    <>
                      A Shift: {shiftCounts.A} <span>||</span>
                    </>
                  )}
                  {shiftCounts.B > 0 && (
                    <>
                      B Shift: {shiftCounts.B} <span>||</span>
                    </>
                  )}
                  {shiftCounts.C > 0 && (
                    <>
                      C Shift: {shiftCounts.C} <span>||</span>
                    </>
                  )}
                  {shiftCounts.G > 0 && <>G Shift: {shiftCounts.G}</>}
                </div>
              </Text>
            </Col>
            <Col span={4} style={{ textAlign: "right" }}>
              <SafetyCertificateTwoTone
                style={{ fontSize: 60, color: "#FFD700" }}
              />
            </Col>
          </Row>

          <Divider style={{ borderColor: "#fff", opacity: 0.2 }} />

          {/* LOADING STATE */}
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Spin size="large" />
            </div>
          ) : (
            <>
              {/* FULL PAGE GRID VIEW (Without Carousel) */}
              <Row gutter={[24, 24]} justify="center">
                {players.map((player, index) => (
                  <Col key={index} xs={24} sm={12} md={12} lg={8}>
                    <Card
                      className="border-blue-500"
                      style={{
                        padding: 5,
                        borderRadius: 16,
                        background: "#24243e",
                        color: "#fff",
                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                        textAlign: "center"
                      }}
                    >
                      <Image
                        src={"/logo.png"}
                        alt="Player"
                        preview={false}
                        style={{
                          width: "100%",
                          maxWidth: "130px",
                          borderRadius: "50%",
                          border: "3px solid #FFD700",
                          boxShadow: "0px 0px 10px rgba(255, 215, 0, 0.5)"
                        }}
                      />
                      <h3
                        className="text-xl mb-1.5"
                        style={{
                          color: "#FFD700",
                          fontWeight: "bold",
                          marginTop: 5
                        }}
                      >
                        {player.Name}
                      </h3>
                      <div className="my-4">
                        <h1 className="!text-base italic font-semibold tracking-wide overflow-hidden text-ellipsis">
                          <span className="font-bold">{player.Name}</span>{" "}
                          {desc[Math.floor(Math.random() * desc.length)]}
                        </h1>
                      </div>
                      <Tag
                        color="blue"
                        className="tracking-wide absolute top-2 uppercase font-semibold text-center right-1"
                        style={{
                          fontSize: 12,
                          padding: "4px 6px",
                          borderRadius: 8
                        }}
                      >
                        Employee Code
                        <h1>{player.EmployeeCode}</h1>
                      </Tag>
                      <Row
                        gutter={[5, 5]}
                        style={{ marginTop: 10, textAlign: "left" }}
                      >
                        <Col span={24}>
                          <Text strong style={{ fontSize: 16, color: "#fff" }}>
                            DEPARTMENT :
                          </Text>{" "}
                          <Text style={{ fontSize: 16, color: "#fff" }}>
                            DRI
                          </Text>
                        </Col>
                        <Col span={24}>
                          <Text strong style={{ fontSize: 16, color: "#fff" }}>
                            SHIFT :
                          </Text>{" "}
                          <Text style={{ fontSize: 16, color: "#fff" }}>
                            {player.shift}
                          </Text>
                        </Col>
                        <Col span={24}>
                          <Text strong style={{ fontSize: 16, color: "#fff" }}>
                            CONTACT :
                          </Text>{" "}
                          <Text style={{ fontSize: 16, color: "#fff" }}>
                            {player.MobileNo}
                          </Text>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                ))}
              </Row>
            </>
          )}
        </Card>
      </Content>
    </Layout>
  );
};

export default App;
