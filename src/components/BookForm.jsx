import { createBook, editBook } from "@/modules/fetch";
import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function BookForm({ bookData }) {
	const toast = useToast();
	const [selectedImage, setSelectedImage] = useState(null);

	async function handleSubmit(event) {
		event.preventDefault();
		if (!selectedImage) {
			toast({
				title: "Error",
				description: "Please select an image",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		}
		const formData = new FormData(event.target);
		if (bookData) {
			try {
				await editBook(
					bookData.id,
					formData.get("title"),
					formData.get("author"),
					formData.get("publisher"),
					parseInt(formData.get("year")),
					parseInt(formData.get("pages"))
				);
				toast({
					title: "Success",
					description: "Book edited successfully",
					status: "success",
					duration: 5000,
					isClosable: true,
				});
			} catch (error) {
				toast({
					title: "Error",
					description: error.response.data.message || "Something went wrong",
					status: "error",
					duration: 5000,
					isClosable: true,
				});
			}
			return;
		}
		try {
			await createBook(formData);
			event.target.reset();
			toast({
				title: "Success",
				description: "Book created successfully",
				status: "success",
				duration: 5000,
				isClosable: true,
			});
			setSelectedImage("");
		} catch (error) {
			toast({
				title: "Error",
				description: error.response.data.message || "Something went wrong",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		}
	}

	useEffect(() => {
		if (bookData?.image) {
			setSelectedImage(bookData?.image);
		}
	}, [bookData]);

	return (
		<form onSubmit={handleSubmit} className="max-w-md mx-auto mt-5 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
			<div className="space-y-4">
				<div className="mb-4">
					<label htmlFor="title" className="block text-sm font-medium text-gray-700">
						Title
					</label>
					<input
						id="title"
						name="title"
						type="text"
						required
						defaultValue={bookData?.title}
						className="mt-1 p-2 border rounded-md w-full"
					/>
				</div>
				<div className="mb-4">
					<label htmlFor="author" className="block text-sm font-medium text-gray-700">
						Author
					</label>
					<input
						id="author"
						name="author"
						type="text"
						required
						defaultValue={bookData?.author}
						className="mt-1 p-2 border rounded-md w-full"
					/>
				</div>
				<div className="mb-4">
					<label htmlFor="publisher" className="block text-sm font-medium text-gray-700">
						Publisher
					</label>
					<input
						id="publisher"
						name="publisher"
						type="text"
						required
						defaultValue={bookData?.publisher}
						className="mt-1 p-2 border rounded-md w-full"
					/>
				</div>
				<div className="mb-4">
					<label htmlFor="year" className="block text-sm font-medium text-gray-700">
						Year
					</label>
					<input
						id="year"
						name="year"
						type="number"
						required
						defaultValue={bookData?.year}
						className="mt-1 p-2 border rounded-md w-full"
					/>
				</div>
				<div className="mb-4">
					<label htmlFor="pages" className="block text-sm font-medium text-gray-700">
						Pages
					</label>
					<input
						id="pages"
						name="pages"
						type="number"
						required
						defaultValue={bookData?.pages}
						className="mt-1 p-2 border rounded-md w-full"
					/>
				</div>
				{selectedImage && <image className="w-64" src={selectedImage} alt="Selected Image" />}
				{!bookData?.image && (
					<div className="mb-4">
						<label htmlFor="image" className="block text-sm font-medium text-gray-700">
							Image
						</label>
						<input
							id="image"
							name="image"
							type="file"
							accept="image/*"
							onChange={(e) => {
								const file = e.target.files[0];
								setSelectedImage(URL.createObjectURL(file));
							}}
							className="mt-1 p-2 border rounded-md w-full"
						/>
					</div>
				)}

				<button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
					{bookData ? "Edit Book" : "Create Book"}
				</button>
			</div>
		</form>
	);
}
