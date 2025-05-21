import React, { useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [tds, setTds] = useState("--");
  const [ph, setPh] = useState("--");
  const [turbidity, setTurbidity] = useState("--");
  const [result, setResult] = useState("");
  const [sensorData, setSensorData] = useState({});

  const getSensorData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/test-firebase");

      if (response.data) {
        const newSensorData = {
          ph: response.data.data.pH,
          tds: response.data.data.TDS,
          turbidity: response.data.data.Turbidity,
        };

        setPh(sensorData.ph);
        setTds(sensorData.tds);
        setTurbidity(sensorData.turbidity);
        setSensorData(newSensorData);

        return newSensorData;
      } else {
        throw new Error("Unexpected sensor data format");
      }
    } catch (error) {
      console.error("Failed to fetch sensor data:", error);
      return null;
    }
  };

  const handlePredict = async () => {
    const data = await getSensorData();
    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", data);
      
      
      
      if (response.data) {
        

        setResult(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClear = () => {
    setTds("--");
    setPh("--");
    setTurbidity("--");
    setResult("");
  };

  return (
    <>
      <div className="w-screen h-screen bg-white pt-10 px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800">AquaIntel</h1>
          <p className="text-lg text-gray-700 mt-2">
            Real-time Water Quality Assessment
          </p>
        </div>

        <div className="flex justify-center items-start">
          <div className="w-[270px] h-[160px] bg-white flex flex-col justify-center items-center mx-4 shadow-[inset_1px_1px_2px_4px_rgba(0,0,0,0.2)] rounded-2xl">
            <div className="w-full text-center">
              <p className="text-gray-500 text-lg font-medium mt-4">pH</p>
              <hr className="w-1/2 mx-auto border-gray-200 my-1" />
            </div>
            <div className="flex-1 flex items-center justify-center">
              <p className="text-2xl font-semibold text-gray-800">{sensorData.ph}</p>
            </div>
          </div>

          <div className="w-[270px] h-[160px] bg-white flex flex-col justify-center items-center mx-4 shadow-[inset_1px_1px_2px_4px_rgba(0,0,0,0.2)] rounded-2xl">
            <div className="w-full text-center">
              <p className="text-gray-500 text-lg font-medium mt-4">TDS</p>
              <hr className="w-1/2 mx-auto border-gray-200 my-1" />
            </div>
            <div className="flex-1 flex items-center justify-center">
              <p className="text-2xl font-semibold text-gray-800">{sensorData.tds}</p>
            </div>
          </div>

          <div className="w-[270px] h-[160px] bg-white flex flex-col justify-center items-center mx-4 shadow-[inset_1px_1px_2px_4px_rgba(0,0,0,0.2)] rounded-2xl">
            <div className="w-full text-center">
              <p className="text-gray-500 text-lg font-medium mt-4">
                Turbidity
              </p>
              <hr className="w-1/2 mx-auto border-gray-200 my-1" />
            </div>
            <div className="flex-1 flex items-center justify-center">
              <p className="text-2xl font-semibold text-gray-800">
                {sensorData.turbidity}
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-center space-x-6 mt-10">
          <button
            onClick={() => handlePredict()}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
          >
            Predict
          </button>
          <button
            onClick={() => handleClear()}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition cursor-pointer"
          >
            Clear
          </button>
        </div>
        {result && result.message !== undefined && (
          <div className="text-center mt-6">
            <p className="text-xl text-gray-700 font-medium">
              The result is:{" "}
              <span
                className={`font-semibold ${
                  result.message[0] === 1 ? "text-green-600" : "text-red-600"
                }`}
              >
                {result.message[0] === 1 ? "Safe" : "Unsafe"}
              </span>
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
