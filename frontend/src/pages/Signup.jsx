import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Signup failed.");
        return;
      }

      localStorage.setItem(
        "user",
        JSON.stringify({
          _id: data._id,
          username: data.username,
          email: data.email,
          role: data.role,
        })
      );
      localStorage.setItem("token", data.token);

      setMessage("Signup successful! Redirecting...");

      setTimeout(() => {
        if (data.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }, 900);
    } catch (err) {
      setMessage("Server error");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="mb-6 text-center text-3xl font-bold text-purple-700">Create Account</h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-purple-400"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-purple-400"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-purple-400"
            required
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-purple-600 py-2 font-semibold text-white shadow-lg transition hover:bg-purple-700"
          >
            Sign Up
          </button>
        </form>
        {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button onClick={() => navigate("/login")} className="text-purple-600 hover:underline">
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default Signup;
