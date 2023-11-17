import {
	Box,
	Button,
	Flex,
	Heading,
	HStack,
	Popover,
	PopoverArrow,
	PopoverBody,
	PopoverCloseButton,
	PopoverContent,
	PopoverHeader,
	PopoverTrigger,
	Skeleton,
	Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Wrapper from "@/components/Wrapper";
import { useRouter } from "next/router";
import Link from "next/link";
import { deleteBook, getBookDetailById } from "@/modules/fetch";
import { useAuth } from "@/modules/context/authContext";
import { prisma } from "@/utils/prisma";
import Image from "next/image";

export default function BookDetails({ book }) {
	const router = useRouter();
	const { isLoggedIn } = useAuth();
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleDeleteBook = async () => {
		try {
			await deleteBook(router.query.id);
			router.push("/");
		} catch (e) {
			console.log(e);
		}
	};

	function handleDeleteClick() {
		setIsModalOpen(true);
	}

	function closeModal() {
		setIsModalOpen(false);
	}

	return (
		<Wrapper>
			<div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
				<div className="md:flex">
					<div className="md:flex-shrink-0">
						<img
							className="h-48 w-full object-cover md:w-48 rounded-lg"
							src={`${book.image.replace(/\\/g, "/")}`}
							alt={book.title}
						/>
					</div>
					<div className="p-8">
						<h1 className="text-2xl font-bold">Title : {book.title}</h1>
						<p className="text-xl font-semibold text-gray-500">Author : {book.author}</p>
						<p className="text-xl font-semibold text-gray-500">Publisher : {book.publisher}</p>
						<p className="text-xl font-semibold text-gray-500">Pages : {book.pages}</p>
						<p className="text-xl font-semibold text-gray-500 mb-4">Year : {book.year}</p>
					</div>
				</div>
				<hr className="pb-4" />
				{isLoggedIn && (
					<div className="flex justify-center space-x-4">
						<button onClick={handleDeleteClick} className="px-4 py-2 bg-red-500 text-white rounded">
							Delete
						</button>
						<Link href={`/edit/${router.query.id}`}>
							<button className="px-4 py-2 bg-blue-500 text-white rounded">Edit</button>
						</Link>
					</div>
				)}

				{isModalOpen && (
					<div className="fixed z-10 inset-0 overflow-y-auto">
						<div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
							<div className="fixed inset-0 transition-opacity" aria-hidden="true">
								<div className="absolute inset-0 bg-gray-500 opacity-75"></div>
							</div>
							<div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
								<div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
									<h3 className="text-lg leading-6 font-medium text-gray-900">Delete Book</h3>
									<div className="mt-2">
										<p className="text-sm text-gray-500">
											Are you sure you want to delete this book? This action cannot be undone.
										</p>
									</div>
								</div>
								<div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
									<button
										onClick={handleDeleteBook}
										type="button"
										className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
									>
										Delete
									</button>
									<button
										onClick={closeModal}
										type="button"
										className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
									>
										Cancel
									</button>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</Wrapper>
	);
}

export async function getStaticPaths() {
	// get all books id
	const books = await prisma.book.findMany({
		select: {
			id: true,
		},
	});
	const paths = books.map((book) => ({
		params: { id: book.id.toString() },
	}));
	return {
		paths: paths,
		fallback: "blocking",
	};
}

export async function getStaticProps(context) {
	try {
		const book = await prisma.book.findUnique({
			where: { id: Number(context.params.id) },
		});
		return {
			props: {
				book,
			},
			revalidate: 10,
		};
	} catch (e) {
		console.log(e);
		return {
			props: {},
		};
	}
}
