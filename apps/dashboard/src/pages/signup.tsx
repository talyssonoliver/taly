import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const Signup = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await axios.post("/api/auth/signup", { email, password });
			router.push("/login");
		} catch (err) {
			setError(err.response.data.message);
		}
	};

	return (
		<div>
			<h1>Sign Up</h1>
			<form onSubmit={handleSubmit}>
				<div>
					<label>Email</label>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
				<div>
					<label>Password</label>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				{error && <p>{error}</p>}
				<button type="submit">Sign Up</button>
			</form>
		</div>
	);
};

export default Signup;