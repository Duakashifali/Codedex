// Original lesson content. Block types: h=heading, p=paragraph, code, tip, img=diagram
const h = (x) => ({ t: 'h', x }), p = (x) => ({ t: 'p', x }), code = (x) => ({ t: 'code', x }), tip = (x) => ({ t: 'tip', x }), img = (x) => ({ t: 'img', x });
const ex = (title, xp, blocks, hint, task) => ({ title, xp, blocks, hint, task });
const web = (goal, files, check) => ({ goal, run: 'web', files, check });
const js = (goal, check, start = '// Write your code below\n') => ({ goal, run: 'js', files: { 'script.js': start }, check });
const py = (goal, check, start = '# Write your code below\n') => ({ goal, run: 'py', files: { 'main.py': start }, check });
const sql = (goal, check, out) => ({ goal, run: 'sql', files: { 'query.sql': '-- Write your query below\n' }, check, out });
const PAGE = '<h1>Mineville Cafe</h1>\n<p class="tag">Fresh blocks daily</p>\n<div class="box">Order here</div>\n';

export const LESSONS = {
  html: [
    ex('Meet HTML', 10, [h('What is HTML?'), p('HTML (HyperText Markup Language) is the skeleton of every web page. You wrap text in tags such as <h1> and <p> to tell the browser what each piece means.'), img('tree'), p('Tags usually come in pairs: an opening tag, the content, and a closing tag with a slash.'), code('<h1>Hello!</h1>\n<p>My first page.</p>'), tip('Tap Run to see your page appear below the editor.')],
      'Wrap your name in <h1> and </h1>, then add a <p> line.', web('Add an <h1> heading with your name and a <p> paragraph about yourself.', { 'index.html': '<!-- Write code below -->\n' }, [['<h1[^>]*>[^<]+</h1>', 'Add an <h1> heading with text'], ['<p[^>]*>[^<]+</p>', 'Add a <p> paragraph with text']])),
    ex('Headings & Paragraphs', 10, [h('Headings'), p('HTML has six heading levels, <h1> (biggest) to <h6> (smallest). Use one <h1> per page for the main title, then <h2> for sections.'), code('<h1>Main title</h1>\n<h2>Section</h2>\n<p>Text goes here.</p>'), tip('Browsers collapse extra spaces, so use new tags for new paragraphs.')],
      'You need one <h2> and at least two <p> tags.', web('Create an <h1>, an <h2>, and two <p> paragraphs.', { 'index.html': '<h1>My Hobbies</h1>\n' }, [['<h2[^>]*>[^<]+</h2>', 'Add an <h2> heading'], ['<p[\\s>][\\s\\S]*<p[\\s>]', 'Add two <p> paragraphs']])),
    ex('Links & Lists', 15, [h('Links'), p('The <a> tag makes a link. The href attribute holds the address it points to.'), code('<a href="https://example.com">Visit</a>'), h('Lists'), p('Use <ul> for bullets and <ol> for numbers. Each item sits inside an <li>.'), code('<ul>\n  <li>Apples</li>\n  <li>Bread</li>\n</ul>')],
      'Put <li> items inside <ul> ... </ul>.', web('Add a link with an href and a bulleted list with three items.', { 'index.html': '<!-- Write code below -->\n' }, [['<a\\s[^>]*href=', 'Add an <a> tag with href'], ['<ul[\\s\\S]*<li[\\s\\S]*<li[\\s\\S]*<li', 'Add a <ul> with three <li> items']])),
    ex('How Pages Load', 10, [h('Browser meets server'), p('When you type an address, your browser sends a request. The server replies with HTML, and the browser draws it on screen.'), img('flow'), p('Every page you build is just a text file the server can send back.'), tip('Nothing to code here. Read, then press Mark complete.')], 'Just read this one!'),
    ex('Page Structure', 15, [h('Semantic tags'), p('Tags like <header>, <main> and <footer> give your page meaning for people and search engines.'), img('tree'), code('<header>Site name</header>\n<main>Content</main>\n<footer>Thanks!</footer>')],
      'Wrap each part in its own tag.', web('Build a page with <header>, <main> and <footer>.', { 'index.html': '<!-- Write code below -->\n' }, [['<header', 'Add a <header>'], ['<main', 'Add a <main>'], ['<footer', 'Add a <footer>']])),
    ex('Project: Profile Card', 20, [h('Put it all together'), p('Combine headings, paragraphs, a list and a link to make a tiny profile page. Take your time and press Run often.')],
      'Re-read the earlier lessons if you get stuck.', web('Make a profile: <h1>, a <p>, a <ul> with 2+ items and an <a> link.', { 'index.html': '<!-- Build your profile -->\n' }, [['<h1', 'Add an <h1>'], ['<p[\\s>]', 'Add a <p>'], ['<ul[\\s\\S]*<li[\\s\\S]*<li', 'Add a list with two items'], ['<a\\s[^>]*href', 'Add a link']])),
  ],
  css: [
    ex('What is CSS?', 10, [h('Style your page'), p('CSS tells the browser how things look: colors, sizes and spacing. A rule has a selector (what to style) and declarations (how to style it).'), img('selector'), tip('The HTML is already written for you. Edit styles.css and press Run.')],
      'Try: h1 { color: tomato; }', web('Make the <h1> a different color.', { 'index.html': PAGE, 'styles.css': '/* Write code below */\n' }, [['h1\\s*\\{[^}]*color\\s*:', 'Set a color on h1']])),
    ex('Classes', 10, [h('Target one element'), p('A class lets you style specific elements. Add class="box" in HTML, then select it with a dot in CSS.'), code('.box {\n  background-color: gold;\n}')],
      'The selector starts with a dot: .box', web('Give the .box a background color.', { 'index.html': PAGE, 'styles.css': '/* Write code below */\n' }, [['\\.box\\s*\\{[^}]*background(-color)?\\s*:', 'Style .box with a background']])),
    ex('The Box Model', 15, [h('Every element is a box'), p('Content sits inside padding, which sits inside a border, which sits inside margin.'), img('boxmodel'), code('.box {\n  padding: 16px;\n  border: 4px solid black;\n  margin: 20px;\n}')],
      'Use all three properties in one .box rule.', web('Give .box padding, a border and a margin.', { 'index.html': PAGE, 'styles.css': '/* Write code below */\n' }, [['padding\\s*:', 'Add padding'], ['border\\s*:', 'Add a border'], ['margin\\s*:', 'Add a margin']])),
    ex('Fonts & Sizes', 10, [h('Text styling'), p('font-size changes how big text is, font-family picks the typeface, and text-align moves it left, center or right.'), code('h1 {\n  font-size: 40px;\n  text-align: center;\n}')],
      'Style the h1 selector.', web('Center the <h1> and change its font-size.', { 'index.html': PAGE, 'styles.css': '/* Write code below */\n' }, [['font-size\\s*:', 'Set font-size'], ['text-align\\s*:\\s*center', 'Center the text']])),
    ex('Flexbox Layout', 20, [h('Line things up'), p('Setting display: flex on a parent lays its children in a row. justify-content decides how they spread out.'), img('flex'), code('.row {\n  display: flex;\n  justify-content: space-between;\n}')],
      'Add display: flex to .row', web('Make .row a flex container with justify-content.', { 'index.html': '<div class="row">\n  <div class="item">A</div>\n  <div class="item">B</div>\n  <div class="item">C</div>\n</div>\n', 'styles.css': '.item { background: #6ab7ff; padding: 12px; }\n' }, [['display\\s*:\\s*flex', 'Use display: flex'], ['justify-content\\s*:', 'Add justify-content']])),
  ],
  js: [
    ex('Hello, console', 10, [h('Talking to the console'), p('console.log() prints a message so you can see what your program is doing.'), code('console.log("Hello!");'), tip('Your messages appear in the Console box under the editor.')],
      'Put your text inside quotes.', js('Print any message using console.log().', [['console\\.log\\(', 'Call console.log(...)']])),
    ex('Variables', 15, [h('Named boxes'), p('A variable stores a value under a name. Use let for values that change and const for ones that do not.'), img('variable'), code('let age = 12;\nconsole.log(age);')],
      'Try: const name = "Alex";', js('Create a variable and print it.', [['(let|const)\\s+\\w+\\s*=', 'Create a variable with let or const'], ['console\\.log\\(\\s*\\w+\\s*\\)', 'Print the variable']])),
    ex('Math', 10, [h('Numbers'), p('JavaScript can add (+), subtract (-), multiply (*) and divide (/). Brackets decide what happens first.'), code('console.log(2 + 3 * 4);')],
      'Try console.log(6 * 7);', js('Print the result of a math expression.', [['console\\.log\\(\\s*[\\d(][\\d\\s+\\-*/().]*[+\\-*/][\\d\\s+\\-*/().]*\\)', 'Log a calculation like 4 * 5']])),
    ex('Loops', 15, [h('Repeat things'), p('A for loop repeats code. Here it counts from 1 to 5.'), img('loop'), code('for (let i = 1; i <= 5; i++) {\n  console.log(i);\n}')],
      'for (let i = 1; i <= 5; i++) { ... }', js('Use a for loop to print numbers.', [['for\\s*\\(', 'Write a for loop'], ['console\\.log', 'Log inside the loop']])),
    ex('Functions', 20, [h('Reusable recipes'), p('A function packages code under a name so you can run it again and again.'), code('function greet(name) {\n  console.log("Hi " + name);\n}\ngreet("Sam");')],
      'Do not forget to call the function!', js('Write a function and call it.', [['function\\s+\\w+\\s*\\(', 'Define a function'], ['\\n\\s*\\w+\\s*\\([^)]*\\)\\s*;', 'Call your function']])),
  ],
  python: [
    ex('Say hello', 10, [h('print()'), p('print() shows text on the screen. Text goes inside quotes.'), code('print("Hello, world!")'), tip('Python cannot run natively inside Expo Go, so this app simulates print, variables and math.')],
      'print("your text")', py('Print a message.', [['print\\(\\s*["\'].+["\']\\s*\\)', 'Use print("...")']])),
    ex('Variables', 10, [h('Labeled boxes'), p('A variable gives a name to a value so you can use it later.'), img('variable'), code('age = 12\nprint(age)')],
      'name = "Sam" then print(name)', py('Make a variable and print it.', [['^\\s*\\w+\\s*=\\s*.+', 'Create a variable'], ['print\\(\\s*\\w+\\s*\\)', 'Print the variable']])),
    ex('Math', 10, [h('Numbers'), p('Python follows math order: brackets, then * and /, then + and -.'), code('print(2 + 3 * 4)')],
      'print(10 / 2)', py('Print a calculation.', [['print\\(\\s*[\\d(][\\d\\s+\\-*/().]*[+\\-*/][\\d\\s+\\-*/().]*\\)', 'Print a math expression']])),
    ex('f-strings', 15, [h('Mix text and values'), p('Put f before the quotes and wrap names in curly braces to insert values.'), code('name = "Sam"\nprint(f"Hi {name}!")')],
      'Start the string with f', py('Use a variable inside an f-string.', [['\\w+\\s*=\\s*["\']', 'Create a text variable'], ['print\\(\\s*f["\'].*\\{\\w+\\}', 'Print an f-string using {name}']])),
  ],
  sql: [
    ex('SELECT *', 10, [h('Tables hold data'), p('A table has columns (fields) and rows (records). SELECT * returns everything.'), img('table'), code('SELECT * FROM students;')],
      'SELECT * FROM students;', sql('Select every column from students.', [['select\\s+\\*\\s+from\\s+students', 'SELECT * FROM students']], 'id | name | age\n1  | Ava  | 12\n2  | Ben  | 14\n3  | Cleo | 11')),
    ex('Pick columns', 10, [h('Only what you need'), p('List column names after SELECT to get just those columns.'), code('SELECT name, age FROM students;')],
      'Separate columns with a comma.', sql('Select name and age from students.', [['select\\s+name\\s*,\\s*age\\s+from\\s+students', 'SELECT name, age FROM students']], 'name | age\nAva  | 12\nBen  | 14\nCleo | 11')),
    ex('Filter with WHERE', 15, [h('Filtering rows'), p('WHERE keeps only the rows that match a condition.'), img('table'), code('SELECT * FROM students\nWHERE age > 11;')],
      'Add WHERE age > 11', sql('Select students older than 11.', [['select[\\s\\S]*from\\s+students[\\s\\S]*where\\s+age\\s*>\\s*11', 'Use WHERE age > 11']], 'id | name | age\n1  | Ava  | 12\n2  | Ben  | 14')),
  ],
  cs: [ex('What is an algorithm?', 10, [h('Step-by-step plans'), p('An algorithm is a clear list of steps that solves a problem, like a recipe.'), img('loop'), p('Computers love algorithms because they follow steps exactly.')], 'Think of a recipe.'), ex('Memory', 10, [h('Variables live in memory'), p('Computers store values in memory slots with names.'), img('variable')], 'Read and continue.')],
  ai: [ex('How models learn', 10, [h('Data in, answers out'), p('A model studies many examples, finds patterns, then uses them on new data.'), img('flow')], 'Patterns, not magic.'), ex('Good prompts', 10, [h('Be specific'), p('Tell the assistant the goal, the context and the format you want. Check its answer before you trust it.')], 'Specific beats vague.')],
  design: [ex('Spacing', 10, [h('Breathing room'), p('Padding and margin keep designs readable. Consistent spacing makes layouts feel calm.'), img('boxmodel')], 'Use a spacing scale.'), ex('Color', 10, [h('Pick a palette'), p('Choose one main color, one accent and neutral shades. Make sure text has strong contrast.')], 'Contrast matters.')],
  pandas: [ex('DataFrames', 10, [h('Tables in Python'), p('A DataFrame is a table with labeled columns and rows, just like a spreadsheet.'), img('table')], 'Rows and columns.')],
  ml: [ex('Training', 10, [h('Learning from examples'), p('Training adjusts a model until its guesses match the known answers.'), img('flow')], 'Practice makes better.')],
  game: [ex('The game loop', 10, [h('Update, draw, repeat'), p('Every game repeats a loop: read input, update the world, then draw the screen, many times a second.'), img('loop')], 'Loop forever.')],
};
