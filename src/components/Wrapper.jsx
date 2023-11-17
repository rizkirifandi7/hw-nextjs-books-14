import Navbar from "./Navbar";

function Wrapper(props) {
	return (
		<div className="min-h-screen">
			<Navbar />
			<main className="flex flex-wrap justify-center w-full mt-5">{props.children}</main>
		</div>
	);
}

export default Wrapper;
