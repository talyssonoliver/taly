import type React from "react";
import Link from "next/link";

const Navbar: React.FC = () => {
	return (
		<nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
			<div className="text-xl font-bold">
				<Link href="/">
					<span className="cursor-pointer">Taly Booking</span>
				</Link>
			</div>
			<ul className="flex space-x-6">
				<li>
					<Link href="/about">
						<span className="cursor-pointer hover:text-blue-600">About</span>
					</Link>
				</li>
				<li>
					<Link href="/services">
						<span className="cursor-pointer hover:text-blue-600">Services</span>
					</Link>
				</li>
				<li>
					<Link href="/contact">
						<span className="cursor-pointer hover:text-blue-600">Contact</span>
					</Link>
				</li>
			</ul>
			<div>
				<Link href="/login">
					<button type= "button" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
						Login
					</button>
				</Link>
			</div>
		</nav>
	);
};

export default Navbar;
