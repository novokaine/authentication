import { Outlet } from "react-router";

const AuthWrapper = () => {
  return (
    <div>
      <h2>Auth wrapper here</h2>
      <Outlet />
    </div>
  );
};

export default AuthWrapper;
