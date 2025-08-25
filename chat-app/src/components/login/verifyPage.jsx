import { Suspense } from "react";

// IMPORTS
import VerifyOtp from "./verifyOtp";
import LoadingPage from './LoadingPage'


function VerifyPage() {
  return (
    <>
      <Suspense fallback={<LoadingPage/>}>
        <VerifyOtp></VerifyOtp>
      </Suspense>
    </>
  );
}
export default VerifyPage;
