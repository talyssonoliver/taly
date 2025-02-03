import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const Signup: React.FC = () => {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null); // Reset error state

		try {
			await axios.post("/api/auth/signup", { email, password });
			router.push("/login");
		} catch (err) {
			if (axios.isAxiosError(err) && err.response) {
				setError(err.response.data.message || "Signup failed");
			} else {
				setError("An unexpected error occurred");
			}
		}
	};

	return (
		<div>
			<h1>Sign Up</h1>
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="email">Email</label>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
				<div>
					<label htmlFor="password">Password</label>
					<input
						id="password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				{error && <p style={{ color: "red" }}>{error}</p>}
				<button type="submit">Sign Up</button>
			</form>
		</div>
	);
};

export default Signup;
