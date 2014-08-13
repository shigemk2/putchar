.intel_syntax noprefix

# [esp] return address
# [esp+4] mem
# [esp+8] putchar
# [esp+12] printhex

push 'H'
call [esp+12]
pop eax
push dword ptr[esp+4]
call [esp+16]
pop eax
ret

mov dword ptr[esi], 0x12345678
push esi
