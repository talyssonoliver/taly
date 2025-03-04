import type React from "react";
import Head from "next/head";

interface EmptyLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const EmptyLayout: React.FC<EmptyLayoutProps> = ({
  children,
  title = "Taly Booking",
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content="Minimal layout for specific pages"
        />{" "}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="empty-layout-container">{children}</main>{" "}
    </>
  );
};

export default EmptyLayout;
