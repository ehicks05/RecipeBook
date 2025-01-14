'use client';

import { useUser } from '@clerk/nextjs';
import { Button, Container, Hero, T } from 'components/core';
import Link from 'next/link';
import React, { useState } from 'react';
import { HiOutlineClock, HiPencilAlt } from 'react-icons/hi';
import type { RecipeFull } from 'trpc/types';

import { Directions, Ingredients } from './Components';

interface Props {
	recipe: RecipeFull;
}

function Recipe({ recipe }: Props) {
	const { user } = useUser();
	const [isShowDescription, setIsShowDescription] = useState(true);
	const toggle = () => setIsShowDescription(!isShowDescription);

	return (
		<>
			<Hero title={`${recipe.name}`}>
				<T className="text-sm font-semibold">
					<div className="">
						{recipe.author.displayName} |{' '}
						<HiOutlineClock size={16} className="inline dark:text-neutral-200" />{' '}
						{recipe.cookingTime}
					</div>
				</T>
			</Hero>
			<Container>
				<div className="grid grid-cols-1 justify-between gap-4 sm:grid-cols-2 md:grid-cols-4">
					<div className="order-1 flex flex-col gap-4">
						{user?.id === recipe.authorId && (
							<div className="flex flex-wrap gap-2">
								<Link href={`/edit-recipe/${recipe.id}`} title="Edit Recipe">
									<Button className="text-sm font-semibold">
										<HiPencilAlt className="text-2xl" />
										Edit
									</Button>
								</Link>
							</div>
						)}
						<div className="cursor-pointer" onClick={toggle} onKeyUp={toggle}>
							<T>{isShowDescription ? recipe.description : 'Click to show'}</T>
						</div>
						{recipe.source && (
							<T className="block text-sm font-semibold">
								<span className="font-normal">from</span>{' '}
								<a href={recipe.source} target="_blank" rel="noreferrer">
									{new URL(recipe.source).host}
								</a>
							</T>
						)}
					</div>
					<div className="order-2 md:order-3">
						<Ingredients
							ingredients={recipe.ingredients}
							defaultServings={recipe.servings}
						/>
					</div>
					<div className="order-3 sm:col-span-2 md:order-2">
						<Directions directions={recipe.directions} />
					</div>
				</div>
			</Container>
		</>
	);
}

export default Recipe;
