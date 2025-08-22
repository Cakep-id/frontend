import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import FooterAdmin from "../components/admin/FooterAdmin";
import TrainingAI from "../components/admin/TrainingAI";
import TrainingData from "../components/admin/TrainingData";
import MainTrain from "../components/train/MainTrain";
import NavbarTrain from "../components/train/NavbarTrain";

// Dynamic import untuk DatasetManager dari folder train
const DatasetManager = lazy(() => import("../components/train/DatasetManager"));

const Train = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarTrain />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<MainTrain />} />
          <Route path="/training-data" element={<TrainingData />} />
          <Route path="/training-ai" element={<TrainingAI />} />
          <Route path="/dataset-manager" element={
            <Suspense fallback={<div className="text-center py-4">Loading...</div>}>
              <DatasetManager />
            </Suspense>
          } />
        </Routes>
      </main>
      <FooterAdmin />
    </div>
  );
};

export default Train;
