import type React from "react";
import Head from "next/head";
import Navbar from "../../../shared-ui/src/components/Navbar";
import Footer from "../../../shared-ui/src/components/Footer";


interface PublicLayoutProps {
	children: React.ReactNode;
	title?: string;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({
	children,
	title = "Taly Booking",
}) => {
	return (
		<>
			<Head>
				<title>{title}</title>
				<meta name="description" content="Booking system for salons" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<Navbar />
			<main className="layout-container">{children}</main>
			<Footer />
		</>
	);
};

export default PublicLayout;
