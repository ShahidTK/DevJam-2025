import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";


const LoginPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value || "" // Ensure `name` is always in `formData`
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const apiUrl = isLogin ? "/api/v1/login" : "/api/v1/signup"; // Dynamic API route

            const response = await axios.post("api/v1/users/signup", formData);

            setMessage(response.data.message);
            console.log("Success:", response.data);
            navigate("/"); 
        } catch (error) {
            setMessage(error.response?.data?.message || "Something went wrong");
            console.error("Error:", error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-4">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-xs md:max-w-md transition-all duration-300">
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        {isLogin ? "Login" : "Sign Up"}
                    </h1>
                    <p className="text-gray-600 text-sm">
                        {isLogin ? "Continue your learning journey" : "Start your learning journey"}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <input
                            type="text"
                            name="name"
                            value={formData.name} // ✅ Add value
                            placeholder="Full Name"
                            required
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                        />
                    )}

                    <input
                        type="email"
                        name="email"
                        value={formData.email} // ✅ Add value
                        placeholder="Email Address"
                        required
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                    />

                    <input
                        type="password"
                        name="password"
                        value={formData.password} // ✅ Add value
                        placeholder="Password"
                        required
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 active:scale-95 transition-transform"
                    >
                        {isLogin ? "Login" : "Create Account"}
                    </button>
                </form>

                <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="w-full text-center text-sm text-blue-600 bg-blue-50 py-2 rounded-lg hover:bg-blue-100 active:scale-95 transition-transform"
                >
                    {isLogin ? "New here? Create Account" : "Already have an account? Login"}
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
