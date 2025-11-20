import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "./components/Body";
import Login from "./components/auth/Login";
import Profile from "./components/profile/Profile";
import { Provider } from "react-redux";
import store from "./redux/store";
import SignUp from "./components/auth/SignUp";
import Feed from "./components/profile/Feed";
import Requests from "./components/profile/Requests";
import Connections from "./components/profile/Connections";

function App() {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body />}>
              <Route index element={<Feed />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="/requests" element={<Requests />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
