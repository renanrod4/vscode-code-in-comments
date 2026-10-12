import React from 'react';

export function Component(): JSX.Element {
	/*@code
	const title: string = "Hello TSX";
	*/

	//@code const count: number = 0;

	/*$
	const items: number[] = [1, 2, 3];
	*/

	//$ const active: boolean = true;

	return (
		<div>
			{/*@code
			const inner: string = "Inside TSX block";
			console.log(inner);
			*/}
			{/*$
			const another: string = "TSX abbreviation";
			*/}
			<h1>Test</h1>
		</div>
	);
}
