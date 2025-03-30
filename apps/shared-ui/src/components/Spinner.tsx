import React from "react";

interface SpinnerProps {
	size?: "small" | "medium" | "large";
	color?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
	size = "medium",
	color = "#000",
}) => {
	const getSizeValue = () => {
		switch (size) {
			case "small":
				return "24px";
			case "large":
				return "48px";
			case "medium":
				return "36px";
			default:
				return "36px";
		}
	};

	return (
		<div
			style={{
				display: "inline-block",
				width: getSizeValue(),
				height: getSizeValue(),
				border: "3px solid rgba(0, 0, 0, 0.1)",
				borderTop: `3px solid ${color}`,
				borderRadius: "50%",
				animation: "spin 1s linear infinite",
			}}
		/>
	);
};
