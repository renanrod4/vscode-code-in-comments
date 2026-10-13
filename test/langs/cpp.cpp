#include <iostream>

int a = 1;

/*@code
int k = 11;
*/

int b = 2;

//@code int m = 12
int c = 3;

/*$
int n = 14
*/
int d = 4;

//$ int p = 15
int e = 5;

// Isso é um comentário normal fora de um comentário de highlight
//$ q = 16 // isso é um comentário normal dentro de um comentário de highlight
//$ // ! isso é um comentário normal de erro dentro de um comentário de highlight
// ! isso é um comentário normal de erro fora de um comentário de highlight

//? Estou colocando uma variavel a cada linha para verificar se a extensão não está deixando "vazar" o highlight do código comentado