local a = 1

--[[@code
local k = 11
]]

local b = 2

--@code local m = 12
local c = 3

--[[$
local n = 13
]]
local d = 4

--$ local p = 14
local e = 5

-- Isso é um comentário normal fora de um comentário de highlight
--$ local q = 15 -- isso é um comentário normal dentro de um comentário de highlight
--$ -- ! isso é um comentário normal de erro dentro de um comentário de highlight
-- ! isso é um comentário normal de erro fora de um comentário de highlight

--? Estou colocando uma variavel a cada linha para verificar se a extensão não está deixando "vazar" o highlight do código comentado
