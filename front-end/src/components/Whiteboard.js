// import React, { useEffect, useRef, useState } from "react";
// import { fabric } from "fabric";
// import { io } from "socket.io-client";

// const Whiteboard = ({ room, username }) => {
//   const canvasRef = useRef(null);
//   const [canvas, setCanvas] = useState(null);
//   const [color, setColor] = useState("#000000");
//   const [brushSize, setBrushSize] = useState(5);
//   const socket = useRef(null);

//   // Initialize socket and canvas
//   useEffect(() => {
//     // Initialize Socket.IO connection
//     socket.current = io("http://localhost:8000");

//     // Initialize Fabric.js canvas
//     const canvas = new fabric.Canvas(canvasRef.current, {
//       isDrawingMode: true, // Enable freehand drawing
//     });
//     setCanvas(canvas);

//     // Handle incoming drawing actions
//     socket.current.on("drawing", (data) => {
//       if (data.room === room) {
//         canvas.loadFromJSON(data.canvasState, () => {
//           canvas.renderAll();
//         });
//       }
//     });

//     // Cleanup
//     return () => {
//       if (socket.current) {
//         socket.current.disconnect();
//       }
//       if (canvas) {
//         canvas.dispose();
//       }
//     };
//   }, [room]);

//   // Sync drawing actions
//   useEffect(() => {
//     if (!canvas) return;

//     // Listen for drawing events
//     canvas.on("path:created", (event) => {
//       const canvasState = canvas.toJSON();
//       socket.current.emit("drawing", {
//         room,
//         canvasState,
//         username,
//       });
//     });
//   }, [canvas, room, username]);

//   // Handle color change
//   const handleColorChange = (e) => {
//     setColor(e.target.value);
//     canvas.freeDrawingBrush.color = e.target.value;
//   };

//   // Handle brush size change
//   const handleBrushSizeChange = (e) => {
//     setBrushSize(parseInt(e.target.value, 10));
//     canvas.freeDrawingBrush.width = parseInt(e.target.value, 10);
//   };

//   return (
//     <div>
//       <div style={{ marginBottom: "10px" }}>
//         <label>
//           Color:
//           <input
//             type="color"
//             value={color}
//             onChange={handleColorChange}
//             style={{ marginLeft: "10px" }}
//           />
//         </label>
//         <label style={{ marginLeft: "20px" }}>
//           Brush Size:
//           <input
//             type="range"
//             min="1"
//             max="20"
//             value={brushSize}
//             onChange={handleBrushSizeChange}
//             style={{ marginLeft: "10px" }}
//           />
//         </label>
//       </div>
//       <canvas
//         ref={canvasRef}
//         width={800}
//         height={600}
//         style={{ border: "1px solid #000" }}
//       />
//     </div>
//   );
// };

// export default Whiteboard;