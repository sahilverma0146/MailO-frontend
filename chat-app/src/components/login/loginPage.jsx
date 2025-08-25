import { ArrowRight, Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppData, user_Service } from "../../context/isAuthContext";
import LoadingPage from "./LoadingPage";
import toast from "react-hot-toast";

function LoginPage() {
  const { isAuth, loading: userLoading } = useAppData();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${user_Service}/api/v1/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log(data);
      toast.success(data.message);

      navigate(`/verify?email=${email}`);
    } catch (error) {
      toast.error(error);
    } finally {
      // ** IF MY API GIVES ERROR OR GIVES THE RESULT TEH LOADING BECOME FALSE
      setLoading(false);
    }
  };

  if (userLoading) {
    return <LoadingPage></LoadingPage>;
  }

  if (isAuth) {
    return navigate("/chat");
  }
  return (
    <>
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
            <div className="text-center mb-8">
              <div className=" mx-auto w-20 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                <Mail size={40} className="text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-3">
                Welcome To Chat-App
              </h1>
              <p className=" text-gray-300 text-lg">
                Enter Your Mail To Continue Your Journey
              </p>

              <form onSubmit={handleSubmit} className="space-y-6 mt-12">
                <div>
                  <label
                    htmlFor="email"
                    className="items-start text-sm font-medium text-gray-300 mb-2"
                  ></label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-4 bg-gray-700 border border-gray-600 rounded-lg text-white placegolder-gray-400 mb-2"
                    placeholder="Enter Your Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button
                    disabled={loading}
                    type="submit"
                    className=" w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed "
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        {" "}
                        <Loader2 className="w-5 h-5">
                          Sending Otp To Your Mail
                        </Loader2>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <span>Send Verification Code</span>
                        <ArrowRight className="w-5 h-5"></ArrowRight>
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default LoginPage;
