var ref = require("ref");
var ffi = require("ffi");

var kernel32 = ffi.Library("kernel32", {
    "VirtualAlloc": ["pointer", ["pointer", "size_t", "int", "int"]],
    "VirtualFree": ["bool", ["pointer", "int", "int"]]
});

var MEM_COMMIT  = 0x1000;
var MEM_RELEASE = 0x8000;
var PAGE_EXECUTE_READWRITE = 0x40;

function jitalloc(size) {
    var p = kernel32.VirtualAlloc(ref.NULL, size,
        MEM_COMMIT, PAGE_EXECUTE_READWRITE);
    var ret = p.reinterpret(size);
    ret.free = function() {
        kernel32.VirtualFree(p, 0, MEM_RELEASE);
    };
    return ret;
}

var buf = jitalloc(30000);

buf.binaryWrite(
    // "\x6a\x48" +                 // push 0x48
    // "\xff\x54\x24\x0c" +         // call *0xc(%esp)
    // "\x58" +                     // pop %eax
    // "\xff\x74\x24\x04" +         // pushl  0x4(%esp)
    // "\xff\x54\x24\x10" +         // call   *0x10(%esp)
    // "\x58" +                     // pop    %eax
    // "\xc3" +                     // ret
    "\xc7\x06\x78\x56\x34\x12" + // movl   $0x12345678,(%esi)
    "\x56", 0);                  // push   %esi
var func = ffi.ForeignFunction(buf, "void", ["pointer", "pointer", "pointer"]);
var mem = new Buffer(30000);
mem.fill(0, 0, 30000);

var dl = new ffi.DynamicLibrary("msvcrt", ffi.RTLD_NOW);
var getchar = dl.get("getchar");
var putchar = dl.get("putchar");
console.log(mem);
func(mem, putchar, putchar);
console.log(mem);

buf.free();
