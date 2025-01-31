// biome-ignore lint/style/useImportType: <explanation>
import React from "react";


const Header: React.FC = () => {
	return (
		<header className="bg-blue-600 text-white py-4 px-6 shadow-md">
			<div className="container mx-auto flex justify-between items-center">
				<h1 className="text-xl font-semibold">Taly</h1>
				<nav>
					<ul className="flex space-x-4">
						<li>
							<a href="/dashboard" className="hover:underline">
								Dashboard
							</a>
						</li>
						<li>
							<a href="/settings" className="hover:underline">
								Config
							</a>
						</li>
						<li>
							<a href="/logout" className="hover:underline">
								Logout
							</a>
						</li>
					</ul>
				</nav>
			</div>
		</header>
	);
};

export default Header;
