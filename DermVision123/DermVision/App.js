// import { StatusBar } from "expo-status-bar";
// import PrimaryNavigator from "./navigators/PrimaryNavigator";
// import Home from "./screens/Home";
// import Login from "./screens/Login";
// import Welcome from "./screens/Welcome";
// import Signup from "./screens/Signup";

// export default function App() {
//   return (
//     <>
//       <PrimaryNavigator />
//       <Welcome/>
//       <StatusBar style="auto" />
//     </>
//   );
// }
import { StatusBar } from "expo-status-bar";
import PrimaryNavigator from "./navigators/PrimaryNavigator";

export default function App() {
  return (
    <>
      <PrimaryNavigator />
      <StatusBar style="auto" />
    </>
  );
}
