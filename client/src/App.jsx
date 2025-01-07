import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Typography,
  Row,
  Col,
  Tag,
  Carousel,
  Spin,
  Divider,
  Image
} from "antd";
import { SafetyCertificateTwoTone, TrophyOutlined } from "@ant-design/icons";
import "./App.css";

const { Title, Text } = Typography;

const App = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/sendDRIData")
      .then((response) => {
        if (response.data.status === "success") {
          setPlayers(response.data.data);
        }
      })
      .catch((error) => console.error("Error fetching player data:", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      className="stat-container flex justify-center w-screen min-h-screen flex-col items-center"
      style={{
        background: "linear-gradient(to bottom, #000428, #004e92)",
        padding: "40px 20px"
      }}
    >
      <Row justify="space-between w-full absolute top-3 px-3">
        <Col className="bg-white rounded-md  w-[220px] flex justify-center">
          <Image
            src="/jsw.png"
            alt="JSW Logo"
            className="p-1 object-contain"
            preview={false}
            style={{ height: 90 }}
          />
        </Col>
        <Col className="bg-white rounded-md !w-[220px]">
          <Image
            src="/doclogo.jpg"
            className="object-contain"
            alt="Your Logo"
            preview={false}
            style={{ height: 90 }}
          />
        </Col>
      </Row>
      <Card
        className="stat-card"
        bordered={false}
        style={{
          padding: 32,
          borderRadius: 20,
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
          width: "100%",
          maxWidth: "950px",
          background: "#1b1b3a",
          color: "#fff"
        }}
      >
        {/* HEADER WITH LOGOS AT CORNER */}
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: 20 }}
        >
          <Col span={9}>
            <Title
              level={3}
              className="title uppercase"
              style={{ color: "#FFD700", fontWeight: "bold" }}
            >
              DRI Rakshak Hazir
            </Title>
            <Text
              style={{ color: "#ddd", fontSize: 16 }}
              className="uppercase tracking-wide font-semibold !text-sm"
            >
              Date: {players[0]?.date || "N/A"} | Shift:{" "}
              {players[0]?.shift || "N/A"}
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
        ) : players.length > 0 ? (
          <Carousel autoplay autoplaySpeed={5000} dotPosition="bottom">
            {players.map((player, index) => (
              <div key={index} style={{ padding: 20 }}>
                <Card
                  bordered={false}
                  style={{
                    padding: 30,
                    borderRadius: 16,
                    background: "#24243e",
                    color: "#fff",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)"
                  }}
                >
                  <Row align="middle" gutter={[20, 20]}>
                    {/* PLAYER IMAGE */}
                    <Col span={9} style={{ textAlign: "center" }} className="">
                      <Image
                        src={"/logo.png"}
                        alt="Player"
                        preview={false}
                        className=""
                        style={{
                          width: "100%",
                          maxWidth: "220px",
                          borderRadius: "50%",
                          border: "3px solid #FFD700",
                          boxShadow: "0px 0px 10px rgba(255, 215, 0, 0.5)"
                        }}
                      />
                    </Col>

                    {/* PLAYER INFORMATION */}
                    <Col span={15} className="player-info">
                      <Title
                        level={3}
                        className="player-name !mb-1"
                        style={{ color: "#FFD700", fontWeight: "bold" }}
                      >
                        {player.Name}
                      </Title>
                      <div className="mb-2">
                        <h1 className="text-xs">
                          {" "}
                          JSW's Special Training for DRI (Direct Reduced Iron)
                          focuses on enhancing workforce expertise in ironmaking
                          operations while ensuring safety and efficiency.
                        </h1>
                      </div>
                      <Tag
                        color="gold"
                        style={{
                          fontSize: 14,
                          padding: "4px 8px",
                          borderRadius: 8
                        }}
                      >
                        Employee Code: {player.EmployeeCode}
                      </Tag>

                      <Row gutter={[16, 16]} style={{ marginTop: 10 }}>
                        <Col span={12}>
                          <Text strong style={{ fontSize: 16, color: "#fff" }}>
                            AGE :
                          </Text>{" "}
                          27
                        </Col>
                        <Col span={12}>
                          <Text strong style={{ fontSize: 16, color: "#fff" }}>
                            DEPARTMENT :
                          </Text>{" "}
                          DRI
                        </Col>
                      </Row>
                      <Row
                        gutter={[16, 16]}
                        style={{ marginTop: 5 }}
                        className="uppercase"
                      >
                        <Col span={12}>
                          <Text strong style={{ fontSize: 16, color: "#fff" }}>
                            Speciality :
                          </Text>{" "}
                          Machines
                        </Col>
                        <Col span={12}>
                          <Text strong style={{ fontSize: 16, color: "#fff" }}>
                            Contact :
                          </Text>{" "}
                          {player.MobileNo}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card>
              </div>
            ))}
          </Carousel>
        ) : (
          <div className="flex justify-center items-center py-10">
            <Text strong style={{ fontSize: 20, color: "#888" }}>
              No Data Available
            </Text>
          </div>
        )}

        {/* FOOTER LOGOS AT CORNER */}
      </Card>
    </div>
  );
};

export default App;
