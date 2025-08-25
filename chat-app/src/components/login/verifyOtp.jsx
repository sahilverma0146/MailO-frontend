import { ArrowRight, Lock, Loader2, ChevronLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {useAppData, user_Service} from '../../context/isAuthContext'
import LoadingPage from "./LoadingPage";
import toast from "react-hot-toast";



function VerifyOtp() {

  const {isAuth , setIsAuth , setUser , loading :  userLoading , fetchChats , fetcehedUsersDetails} = useAppData();

  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");

  const [resendLoading, setResendLoading] = useState(false);

  const [timer, setTimer] = useState(60);

  const inputRef = useRef([]); //HERE CREATES THE REFERENCE OBJECT NAME INPUTREF WITH METHOD --> CURRENRT
  const naviagte = useNavigate();

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const email = query.get("email") || "";
  //   console.log(email)

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("PLEASE ENETR ALL SIX DIGITS");
      return;
    }

    setError("");

    setLoading(true);

    try {
      const combinedOtp = otp.join("");
      const response = await fetch(`${user_Service}/api/v1/verifyUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ enteredOtp: combinedOtp, email: email }),
      });
      const data = await response.json();
      console.log(data);
      toast.success(data.message);

      Cookies.set("token", data.token, {
        expires: 15,
        secure: false,
        path: "/",
      });

      setOtp(["", "", "", "", "", "", ""]);
      inputRef.current[0]?.focus();
      setUser(data.user);
      setIsAuth(true);
      fetchChats();
      fetcehedUsersDetails()
    } catch (error) {
      setError(error.response.data.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setError("");

    try {
      const combinedOtp = otp.join("");
      const response = await fetch(`${user_Service}/api/v1/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      });
      const data = await response.json();
      console.log(data);
      toast.success(data.message);

      setTimer(60);
    } catch (error) {
      setError(error.response.data.message);
      console.log(error);
    } finally {
      setResendLoading(false);
    }
  };

  const HandleInputChange = (index, value) => {
    if (value.length > 1) {
      return;
    }

    //OUR OTP IS AN ARRAY SO  *This line creates a copy of the current OTP array so we don't mutate the original state directly. */
    const newOtp = [...otp]; // NEWOTP = ['' , '' , '' , '' ,'' ,'']
    newOtp[index] = value; // TTHIS SETS THE INDEXS
    setOtp(newOtp);

    setError("");

    if (value && index < 5) {
      inputRef.current[index + 1].focus(); // THIS FOCUS ON THE NEXT INPUT FEILD
    }
  };

  // ONBACKSPACE CLEAR THE ARRAY OF OTP ONE-BY-ONE
  const HandleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRef.current[index - 1].focus(); //FOCUS ON THE PREV ONE
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pastedData = e.clipboardData.getData("text"); //GETS THE RAW STRING LIKE "123456" OR "123-456"
    const digits = pastedData.replace(/\D/g, "").slice(0, 6); //REPLACE DOES REMOVING THE LETTERS , SYMBOLS TO ""  *** AND SPLICE  GOING TO TAKE THE FIRST 6 DIGITS

    if (digits.length === 6) {
      const newOtp = digits.split("");
      setOtp(newOtp);
      inputRef.current[5].focus();
    }
  };

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }

    
  }, [timer]);

  // console.log(timer);

  if(userLoading){
    return <LoadingPage></LoadingPage>
  }
  if(isAuth) {
    naviagte('/chat')
  }
  return (
    <>
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
            <div className="text-center mb-8 relative">
              <button className="absolute top-0 left-0 text-gray-300 hover:text-white p-2"><ChevronLeft className="w-6 h-6" onClick={()=>naviagte('/')}></ChevronLeft></button>
              <div className=" mx-auto w-20 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                <Lock size={40} className="text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-3">
                Verify Your Email
              </h1>
              <p className=" text-gray-300 text-lg">We Have Sent Otp To Your</p>
              <p className="text-blue-400 text-sm">{email}</p>

              <form onSubmit={handleSubmit} className="space-y-6 mt-12">
                <div>
                  <label className="items-start text-sm font-medium text-gray-300 mb-4 text-center">
                    Enter Your Six Digit Otp Here
                  </label>
                  <div className="flex justify-center in-checked:space-x-3">
                    {otp.map((digit, index) => (
                      <input
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) =>
                          HandleInputChange(index, e.target.value)
                        }
                        onKeyDown={(e) => HandleKeyDown(index, e)}
                        onPaste={index === 0 ? handlePaste : undefined}
                        key={index}
                        // IN THIS THE **EL** IS THE <INPUT> EVERY TIME THE INPUT RENDER THE REF BINDS ITSELF WITH MULTIPLE <INPUTS>
                        ref={(el) => (inputRef.current[index] = el)} //The function stores this input DOM element at the right position (index) in the inputRef.current array.
                        // ***inputRef.current = [<input0>, <input1>, <input2>, <input3>, <input4>, <input5>];

                        className="w-12 h-12 text-center text-xl border-2 border-gray-600 rounded-lg bg-gray-700 text-white m-2"
                      />
                    ))}
                  </div>

                  {error && (
                    <div className="bg-red-900 border border-red-700 rounded-xl p-3">
                      <p className="text-red-300 text-sm text-center">
                        {error}
                      </p>
                    </div>
                  )}
                  <button
                    disabled={loading}
                    type="submit"
                    className=" w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed "
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        {" "}
                        <Loader2 className="w-5 h-5">Verifying ...</Loader2>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <span>Verify</span>
                        <ArrowRight className="w-5 h-5"></ArrowRight>
                      </div>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-400  text-sm mb-4">
                  Didn't Receive the OTP
                </p>
                {timer > 0 ? (
                  <p className="text-gray-400 mb-4 text-sm">
                    {" "}
                    Resend Code in {timer} seconds
                  </p>
                ) : (
                  <button
                    className="text-blue-400 font-medium hover:text-blue-300 text-sm disabled:opacity-50 dis"
                    disabled={resendLoading}
                    onClick={handleResendOtp}
                  >
                    {resendLoading ? "Sending.." : "Resend Code"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VerifyOtp;
