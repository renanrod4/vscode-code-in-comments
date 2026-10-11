package main

var a = 1

/*@code
k := 11
*/

var b = 2

//@code m := 12
var c = 3

/*$
n := 13
*/
var d = 4

//$ p := 14
var e = 5

// Isso é um comentário normal fora de um comentário de highlight
//$ q := 15 // isso é um comentário normal dentro de um comentário de highlight
//$ // ! isso é um comentário normal de erro dentro de um comentário de highlight
// ! isso é um comentário normal de erro fora de um comentário de highlight

//? Estou colocando uma variavel a cada linha para verificar se a extensão não está deixando "vazar" o highlight do código comentado
