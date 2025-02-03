// // src/pages/ProfilePage.js
// import React from 'react';
// import { useAuth } from '../context/authContext'; // Import the custom hook

// const ProfilePage = () => {
//   const { isLoggedIn, logout } = useAuth(); // Access context values

//   return (
//     <div>
//       <h1>Profile Page</h1>
//       {isLoggedIn ? (
//         <>
//           <p>Welcome to your profile!</p>
//           <button onClick={logout}>Log out</button>
//         </>
//       ) : (
//         <p>You need to log in to access your profile.</p>
//       )}
//     </div>
//   );
// };

// export default ProfilePage;
