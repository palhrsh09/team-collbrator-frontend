// --- 6. ROUTE INDEX WITH PUBLIC/PROTECTED LAYOUT --- //
// src/routes/index.jsx
import { Suspense } from "react";
import Loading from "../components/Loading";
import { protectedRoutes, publicRoutes } from "../config/routes.config";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../routes/ProtectedRoutes";
// import PublicRoute from "../components/route/PublicRoute";

const Views = () => {
  return (
    <Suspense fallback={<Loading loading={true} />}>
      <Routes>
        {protectedRoutes.map((route, i) => (
          <Route
            key={route.key || i}
            element={<ProtectedRoute allowedRoles={route.allowedRoles || []} />}
          >
            <Route path={route.path} element={<route.component />} />
          </Route>
        ))}

        <Route path="/" > 
          {publicRoutes.map((route, i) => (
            <Route
              key={route.key || i}
              path={route.path}
              element={<route.component />}
            />
          ))}
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default Views;
