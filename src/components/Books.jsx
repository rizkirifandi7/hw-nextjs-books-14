import Link from "next/link";

export default function Books({ id, title, author, image, publisher, year }) {
	return (
		<Link href={`/detail/${id}`} className="m-4 w-full sm:w-64">
			<div className="bg-white shadow-lg rounded-md overflow-hidden transition-transform transform hover:scale-105 cursor-pointer">
				<img className="w-full h-40 object-cover rounded-t-lg" src={image} alt={`${id}-${title}`} />
				<div className="p-4">
					<h2 className="text-xl font-bold mb-2">
						{title} ({year})
					</h2>
					<p className="text-gray-600">{author}</p>
					<p className="text-gray-600">
						<span className="font-semibold">Publisher:</span> {publisher}
					</p>
				</div>
			</div>
		</Link>
	);
}
