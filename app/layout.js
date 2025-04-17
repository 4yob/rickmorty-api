import "./globals.css";

export const metadata = {
	title: "Rick and Morty API",
	description: "Meu primeiro consumo de API grátis",
	icons: {
		icon: "/rick.png",
	},
	};
    
	export default function RootLayout({ children }) {
		return (
			<html>
				<body>{children}</body>
			</html>
);
}