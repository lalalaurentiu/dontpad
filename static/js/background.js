let editor = CodeMirror.fromTextArea(document.getElementById("demo"), {
  lineNumbers: true,
  mode: "text/x-perl",
  theme: "abbott",
  lineNumbers: true,
});

let txtList = [
  `<!DOCTYPE html>
<html>
    <head>
    </head>
    <body>
        <h1>Hello World<h1>
    </body>
</html>`,
  `#include <stdio.h>

int main() {
    printf("Hello World");
    return 0;
}`,
  `#include <iostream>
    
    int main() {
        std::cout << "Hello World";
        return 0;
    }`,
  `namespace HelloWorld
{
    class Hello {        
        static void Main(string[] args)
        {
            System.Console.WriteLine("Hello World");
        }
    }
}`,
  `import java.io.*;
    
    class GFG {
        public static void main (String[] args) {
        System.out.println("Hello World");
        }
    }`,
  `console.log 'Hello World'`,
  `console.log("Hello World");`,
  `print("Hello World")`,
  `puts "Hello World"`,
  `echo "Hello World";`,
];

writeText(txtList, editor, 300);
