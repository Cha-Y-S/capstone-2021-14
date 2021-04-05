import React, { useRef, useEffect } from "react";
import "../App.css";
import styled from "styled-components";
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/face-landmarks-detection";
import { drawMesh, checkClick } from "utilities";
import { drawDot } from "./mask";
import { getUserFace } from "./compare";
import { MobXProviderContext } from "mobx-react";
import { saveAs } from "FileSaver";
// const testImg = "../src/Containers/faceSam.png";
import testImg from "./photo/Egg/1.jpg";
import { inject, observer } from "mobx-react";
import { useObserver } from "mobx-react";

// @inject("ManageFile")
// @observer

function useStores() {
  return React.useContext(MobXProviderContext);
}

function FaceOutputContainer() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const { ManageFile } = useStores();
  // const imageRef = React.createRef();

  // Load facemesh
  const runFacemesh = async () => {
    const net = await facemesh.load(
      facemesh.SupportedPackages.mediapipeFacemesh
    );
    detect(net);
    // setInterval(() => {
    //   detect(net);
    // }, 2000); // 1000ms
  };

  // Detect function
  const detect = async (net) => {
    const image = imageRef.current;
    // console.log(image);
    const imageWidth = imageRef.current.width;
    // console.log(imageWidth);
    const imageHeight = imageRef.current.height;

    // Set canvas width
    canvasRef.current.width = imageWidth;
    canvasRef.current.height = imageHeight;

    // const imageElement = document.getElementById("test");
    const face = await net.estimateFaces({
      input: image,
      predictIrises: false,
    });

    // console.log(face);

    // Get canvas context for drawing
    console.log(face[0].scaledMesh);

    if (ManageFile.pageIndex == 4) {
      var blob = new Blob([face[0].scaledMesh], {
        type: "text/plain;charset=utf-8",
      });
      saveAs(blob, "data.txt");
    }

    const ctx = canvasRef.current.getContext("2d");
    drawMesh(face, ctx);

    // drawDot(ctx);

    if (
      typeof webcamRef.current !== "underfined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;

      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make detections
      const face = await net.estimateFaces({ input: video });
      const imageElement = document.getElementById("test");
      // const face = await net.estimateFaces({
      //   input: imageElement,
      // });

      // console.log(face);

      // console.log(document.getElementById("test"));
      // Get canvas context for drawing
      const ctx = canvasRef.current.getContext("2d");
      drawMesh(face, ctx);
      drawDot(ctx);
    }
  };

  // Click the Button
  const ButtonForUserFace = () => {
    checkClick(true);
  };

  const checkUserFace = () => {
    console.log("ok!");
    getUserFace();
    //console.log(userFace);
  };

  runFacemesh();
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={ManageFile.imageUrl} ref={imageRef} /> */}
        <img
          id="test"
          src={ManageFile.imageUrl}
          ref={imageRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 640,
          }}
        />

        {/* <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        /> */}

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 640,
          }}
        />

        {/* <button
          onClick={ButtonForUserFace}
          style={{ marginTop: "50em", marginRight: "8.5em" }}
        >
          Button
        </button>
        <button
          onClick={checkUserFace}
          style={{ marginTop: "-1.7em", marginLeft: "7em" }}
        >
          Check My Face
        </button> */}
      </header>
    </div>
  );
}

export default FaceOutputContainer;