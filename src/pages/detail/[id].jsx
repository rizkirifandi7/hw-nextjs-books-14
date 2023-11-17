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

	const handleDeleteBook = async () => {
		try {
			await deleteBook(router.query.id);
			router.push("/");
		} catch (e) {
			console.log(e);
		}
	};

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
				<hr  className="pb-4"/>
				{isLoggedIn && (
					<div className="flex justify-center space-x-4">
						<button onClick={handleDeleteBook} className="px-4 py-2 bg-red-500 text-white rounded">
							Delete
						</button>
						<Link href={`/edit/${router.query.id}`}>
							<button className="px-4 py-2 bg-blue-500 text-white rounded">Edit</button>
						</Link>
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
