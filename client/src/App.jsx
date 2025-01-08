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
  Pagination,
  Carousel
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
  const pageSize = 9; // Increased the number of profiles per page
  const cardsPerRow = 3; // Each row contains 3 cards
  const timeoutRef = useRef(null); // Store timeout ID

  const fetchData = () => {
    axios
      .get("http://localhost:8000/sendDRIData")
      .then((response) => {
        if (response.data.status === "success") {
          setPlayers(response.data.data);
        }
      })
      .catch((error) => console.error("Error fetching player data:", error))
      .finally(() => setLoading(false));

    // Schedule next fetch in 2 minutes
    timeoutRef.current = setTimeout(fetchData, 2 * 60 * 1000);
  };

  useEffect(() => {
    fetchData(); // Initial call

    return () => clearTimeout(timeoutRef.current); // Cleanup on unmount
  }, []);

  // Grouping players into rows of 3
  const groupedPlayers = [];
  for (let i = 0; i < players.length; i += cardsPerRow) {
    groupedPlayers.push(players.slice(i, i + cardsPerRow));
  }

  const shiftCounts = {
    A: players?.filter((player) => player.shift === "A").length,
    B: players?.filter((player) => player.shift === "B").length,
    C: players?.filter((player) => player.shift === "C").length,
    G: players?.filter((player) => player.shift === "G").length
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Navbar />
      <Content
        className="stat-container flex w-screen !py-16  flex-col items-center"
        style={{
          background: "linear-gradient(to bottom, #000428, #004e92)",
          padding: "15px"
        }}
      >
        <Card
          className="stat-card "
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
                <div className="flex gap-5">
                  Total Employees: {players.length} <span>||</span>
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
              {/* FULL PAGE CAROUSEL VIEW (Each Slide = 1 Row) */}
              <Carousel autoplay autoplaySpeed={5000} dotPosition="bottom">
                {groupedPlayers.map((row, rowIndex) => (
                  <div key={rowIndex}>
                    <Row gutter={[24, 24]} justify="center">
                      {row.map((player, index) => (
                        <Col key={index} xs={24} sm={12} md={12} lg={8}>
                          <Card
                            bordered={false}
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
                                maxWidth: "180px",
                                borderRadius: "50%",
                                border: "3px solid #FFD700",
                                boxShadow: "0px 0px 10px rgba(255, 215, 0, 0.5)"
                              }}
                            />
                            <h3
                              className="text-lg mb-1.5"
                              style={{
                                color: "#FFD700",
                                fontWeight: "bold",
                                marginTop: 5
                              }}
                            >
                              {player.Name}
                            </h3>
                            <div className="my-4">
                              <h1
                                className="!text-xs italic overflow-hidden text-ellipsis"
                                style={{
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2, // Limits the text to 2 lines
                                  WebkitBoxOrient: "vertical",
                                  height: "36px", // Fixed height (Adjust as needed)
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "normal" // Allows text wrapping
                                }}
                              >
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
                                <Text
                                  strong
                                  style={{ fontSize: 16, color: "#fff" }}
                                >
                                  DEPARTMENT :
                                </Text>{" "}
                                <Text
                                  className="!tracking-wide"
                                  style={{ fontSize: 16, color: "#fff" }}
                                >
                                  DRI
                                </Text>{" "}
                              </Col>
                              <Col span={24}>
                                <Text
                                  strong
                                  style={{ fontSize: 16, color: "#fff" }}
                                >
                                  SHIFT :
                                </Text>{" "}
                                <Text style={{ fontSize: 16, color: "#fff" }}>
                                  {player.shift}
                                </Text>{" "}
                              </Col>
                              <Col span={24}>
                                <Text
                                  strong
                                  style={{ fontSize: 16, color: "#fff" }}
                                >
                                  CONTACT :
                                </Text>{" "}
                                <Text style={{ fontSize: 16, color: "#fff" }}>
                                  {player.MobileNo}
                                </Text>{" "}
                              </Col>
                            </Row>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>
                ))}
              </Carousel>
            </>
          )}
        </Card>
      </Content>
    </Layout>
  );
};

export default App;
