import type React from "react";

const Spinner: React.FC<{
	size?: string;
	color?: string;
	className?: string;
}> = ({ size = "w-10 h-10", color = "border-t-blue-600", className = "" }) => {
	return (
		<div className={`flex justify-center items-center ${className}`}>
			<div
				className={`${size} border-4 border-gray-300 ${color} rounded-full animate-spin`}
			/>
		</div>
	);
};

export default Spinner;