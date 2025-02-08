// import React, { useEffect, useRef, useState } from "react";
// import { io } from "socket.io-client";
// import { fabric } from "fabric";

// const WhiteBoard = ({ room, username }) => {
//   const canvasRef = useRef(null);
//   const [canvas, setCanvas] = useState(null);
//   const [color, setColor] = useState("#000000");
//   const [brushSize, setBrushSize] = useState(5);
//   const socket = useRef(null);

//   // Initialize socket and canvas
//   useEffect(() => {
//     socket.current = io("http://localhost:8000");

//     const newCanvas = new fabric.Canvas(canvasRef.current, {
//       isDrawingMode: true,
//     });

//     newCanvas.freeDrawingBrush = new fabric.PencilBrush(newCanvas);
//     newCanvas.freeDrawingBrush.color = color;
//     newCanvas.freeDrawingBrush.width = brushSize;
    
//     setCanvas(newCanvas);

//     // Handle incoming drawing events
//     socket.current.on("drawing", (data) => {
//       if (data.room === room && newCanvas) {
//         newCanvas.loadFromJSON(data.canvasState, () => {
//           newCanvas.renderAll();
//         });
//       }
//     });

//     return () => {
//       socket.current.disconnect();
//       newCanvas.dispose();
//     };
//   }, [room]);

//   // Sync drawing actions
//   useEffect(() => {
//     if (!canvas) return;

//     const handlePathCreated = () => {
//       socket.current.emit("drawing", {
//         room,
//         canvasState: canvas.toJSON(),
//         username,
//       });
//     };

//     canvas.on("path:created", handlePathCreated);

//     return () => {
//       canvas.off("path:created", handlePathCreated);
//     };
//   }, [canvas, room, username]);

//   // Handle color change
//   const handleColorChange = (e) => {
//     const newColor = e.target.value;
//     setColor(newColor);
//     if (canvas && canvas.freeDrawingBrush) {
//       canvas.freeDrawingBrush.color = newColor;
//     }
//   };

//   // Handle brush size change
//   const handleBrushSizeChange = (e) => {
//     const newSize = parseInt(e.target.value, 10);
//     setBrushSize(newSize);
//     if (canvas && canvas.freeDrawingBrush) {
//       canvas.freeDrawingBrush.width = newSize;
//     }
//   };

//   return (
//     <div className="p-4">
//       <div className="mb-4 flex items-center gap-4">
//         <label className="flex items-center gap-2">
//           Color:
//           <input
//             type="color"
//             value={color}
//             onChange={handleColorChange}
//             className="cursor-pointer"
//           />
//         </label>
//         <label className="flex items-center gap-2">
//           Brush Size:
//           <input
//             type="range"
//             min="1"
//             max="20"
//             value={brushSize}
//             onChange={handleBrushSizeChange}
//             className="cursor-pointer"
//           />
//         </label>
//       </div>
//       <canvas
//         ref={canvasRef}
//         width={800}
//         height={600}
//         className="border border-gray-800"
//       />
//     </div>
//   );
// };

// export default WhiteBoard;
