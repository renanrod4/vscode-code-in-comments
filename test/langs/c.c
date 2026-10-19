#include <stdio.h>

int a = 1;

/*@code
int k = 11;
*/

int b = 2;

//@code int m = 12;
int c = 3;

/*$
int n = 14;
*/
int d = 4;

//$ int p = 15;
int e = 5;

// This is a normal comment outside a highlight comment
//$ q = 16; // this is a normal comment inside a highlight comment
//$ // ! this is a normal error comment inside a highlight comment
// ! this is a normal error comment outside a highlight comment

//? I'm putting a variable on each line to check if the extension isn't "leaking" the highlighted code highlight