import { L, T } from './dsl';
const PAGE = '<h1>Mineville Cafe</h1>\n<p id="note" class="tag">Fresh blocks daily</p>\n<div class="box">Order here</div>\n';
const CSS0 = '/* Write code below */\n';

// ---- lessons appended to the existing HTML / CSS / JavaScript courses ----
export const EXTRA_WEB = {
  html: [
    L('Web Architecture', 10, `
# Two sides of every web app
A web application has a client side and a server side. The client is the browser, where people read pages and tap buttons. The server receives each request, runs the application logic and talks to the database.
@arch
# The parts
The browser shows the user interface built with HTML, CSS and JavaScript. The web server handles incoming requests and sends back responses. Application logic does the calculations and works with user input. The database server stores things like user details and orders.
> Browser asks, server answers, database remembers.
`, 'Name the four boxes in the picture.'),
    L('Front End vs Back End', 10, `
# Web engineering
Web engineering is the careful, step-by-step building of websites and web services. It mixes software engineering, design, development and project management so the result is reliable, scalable and friendly to use.
# Two halves
Frontend development covers everything people see and touch: layout, colors, buttons and forms. Backend development covers the hidden work: servers, business rules, security and data.
~~~
Frontend : HTML, CSS, JavaScript
Backend  : PHP (or Node, Python) + MySQL
~~~
HTML itself is the standard markup language that describes the content and structure of every page.
`, 'Which half runs in the browser?'),
  ],
  css: [
    L('CSS Units', 15, `
# Width and height
The width and height properties set the size of an element. The unit you choose decides how it behaves on different screens.
# Common units
px is a fixed size. % is relative to the parent element. vw and vh are percentages of the screen width and height. em and rem scale with font size. auto lets the browser decide.
~~~
.box { width: 50%; height: 100px; }
.hero { height: 100vh; }
~~~
> Use % or vw for flexible layouts, px when something must stay the same size.
`, 'Give .box a width in % and a height in px.',
      T('web', 'Make .box half as wide as its parent and 100px tall.', { 'index.html': PAGE, 'styles.css': CSS0 + '.box { background: gold; }\n' },
        [['width[ ]*:[ ]*[0-9]+%', 'Set width in %'], ['height[ ]*:[ ]*[0-9]+px', 'Set height in px']])),
    L('Selectors in Depth', 15, `
# Four ways to pick elements
The universal selector * styles every element, often used to reset default spacing. A class selector starts with a dot and can be reused. An id selector starts with # and should be unique on the page. A tag selector uses the element name itself.
~~~
* { margin: 0; }
.tag { color: teal; }
#note { font-weight: bold; }
p { font-size: 18px; }
~~~
> Classes can repeat, ids should not.
`, 'The id of the paragraph is note, so the selector is #note.',
      T('web', 'Style the paragraph with the id "note" using an id selector.', { 'index.html': PAGE, 'styles.css': CSS0 },
        [['#note[ ]*[{]', 'Use the #note selector'], ['color[ ]*:', 'Set a color']])),
    L('Padding & Margin', 15, `
# Space inside vs outside
Padding is the space between an element's content and its border. Margin is the space outside the border, pushing other elements away.
@boxmodel
# Shorthand
One value sets all four sides. Two values mean vertical then horizontal. Four values go top, right, bottom, left (clockwise).
~~~
.a { padding: 20px; }
.b { padding: 10px 15px; }
.c { margin: 5px 10px 15px 20px; }
~~~
Padding adds to the element's size, margin does not, and neighbouring vertical margins can collapse into one.
`, 'Two values for padding, four for margin.',
      T('web', 'Give .box padding with two values and margin with four values.', { 'index.html': PAGE, 'styles.css': CSS0 + '.box { background: lightblue; }\n' },
        [['padding[ ]*:[ ]*[0-9]+px[ ]+[0-9]+px[ ]*;', 'Padding with two values'], ['margin[ ]*:[ ]*[0-9]+px[ ]+[0-9]+px[ ]+[0-9]+px[ ]+[0-9]+px', 'Margin with four values']])),
  ],
  js: [
    L('JavaScript in the Browser', 10, `
# What JavaScript does
JavaScript runs inside the browser, so a page can react to people without reloading. It is the third core web technology next to HTML and CSS. Its five big ideas are client-side scripting, syntax (variables, loops, functions), DOM manipulation, event handling and asynchronous programming.
> JavaScript is a lightweight, interpreted language that adds behaviour to pages.
`, 'Name two of the five big ideas.'),
    L('The DOM', 15, `
# Changing a page with code
The Document Object Model (DOM) is how JavaScript sees a page: a tree of elements it can find and change. You can update text, structure and styles while the page is open.
~~~
const title = document.getElementById('title');
title.textContent = 'Hello DOM!';
~~~
`, 'Use document.getElementById then set textContent.',
      T('web', 'Find the heading with id "title" and change its text.', { 'index.html': '<h1 id="title">Old title</h1>\n', 'script.js': '// Write your code below\n' },
        [['getElementById', 'Select the element with getElementById'], ['textContent|innerText|innerHTML', 'Change its text']])),
    L('Events', 15, `
# Reacting to people
JavaScript can listen for clicks, key presses and form submissions. You attach a function to an element, and the browser calls it when the event happens.
~~~
btn.addEventListener('click', () => {
  msg.textContent = 'Clicked!';
});
~~~
`, 'addEventListener takes the event name and a function.',
      T('web', 'When the button is clicked, show a message in the paragraph.', { 'index.html': '<button id="btn">Tap me</button>\n<p id="msg"></p>\n', 'script.js': "const btn = document.getElementById('btn');\nconst msg = document.getElementById('msg');\n// add your listener below\n" },
        [['addEventListener[ ]*[(][ ]*.click', 'Listen for the click event'], ['msg[.]textContent|msg[.]innerText', 'Update the message text']])),
    L('Async Basics', 15, `
# Do not block the page
Asynchronous code lets slow work, like loading data from an API, happen without freezing everything else. JavaScript supports callbacks, promises and async/await for this.
~~~
setTimeout(() => console.log('later'), 500);
console.log('first');
~~~
The second line prints first, then the timer fires half a second later.
`, 'Use setTimeout with a function and a delay in milliseconds.',
      T('js', 'Print one message now and another after a short delay using setTimeout.', { 'script.js': '// Write your code below\n' },
        [['setTimeout[ ]*[(]', 'Use setTimeout'], ['console[.]log', 'Log a message']])),
  ],
};

// ---- brand-new course: PHP & MySQL (server side) ----
export const FULL_WEB = {
  php: [
    L('Server-Side Programming', 10, `
# What the server does
Server-side programming is the work a server does when a browser sends a request. It lets a site build dynamic pages, for example by reading data from a database and shaping it before sending a response.
@phpflow
# Client-server model
The browser sends a request, the server runs your script, talks to the database if needed, and returns plain HTML that the browser shows.
`, 'Which box runs the PHP script?'),
    L('Web Server & XAMPP', 10, `
# Web servers
A web server is software that serves web pages over HTTP. It receives requests, finds the right files or runs the right code, and returns the result.
# Installing XAMPP
XAMPP bundles Apache, MySQL and PHP so your own computer can act as a server.
@xampp
~~~
1. Download XAMPP from apachefriends.org
2. Run the installer
3. Choose Apache, MySQL and PHP
4. Open the XAMPP Control Panel and start the services
5. Visit localhost in your browser
~~~
`, 'Start Apache and MySQL in the Control Panel.'),
    L('Apache, MySQL & First PHP File', 10, `
# Apache and MySQL
Apache turns your machine into a web server. It serves pages from a folder, usually htdocs inside the XAMPP folder. MySQL stores your data and is managed in the browser with phpMyAdmin.
# Your first script
PHP code lives inside tags. Comments use // or # for one line and /* */ for several.
~~~
<?php
  echo "Hello, World!";
?>
~~~
Save it as hello.php in htdocs, then open localhost/hello.php.
`, 'Use echo inside <?php ... ?> tags.',
      T('check', 'Write a PHP script that prints Hello, World!', { 'hello.php': '<?php\n  // write your code below\n?>\n' },
        [['<[?]php', 'Open with <?php'], ['echo', 'Use echo to print'], ['[?]>', 'Close with ?>']], 'Hello, World!')),
    L('Variables, Operators & Types', 15, `
# Variables
PHP variables start with a dollar sign and need no type declaration.
~~~
$name = "Ali";
$age = 25;
~~~
# Types and operators
Common types are string, integer, float, boolean and array. Comparison operators such as == and > compare values, and logical operators like && combine conditions.
~~~
$fruits = array("Apple", "Banana", "Mango");
if ($age > 18 && $name == "Ali") { }
~~~
`, 'Variable names begin with $.',
      T('check', 'Create $name and $age, then print them.', { 'vars.php': '<?php\n  // write your code below\n?>\n' },
        [['[$]name[ ]*=', 'Create $name'], ['[$]age[ ]*=', 'Create $age'], ['echo', 'Print with echo']], 'Ali is 25')),
    L('Conditions & Loops', 15, `
# Making decisions
if runs code when a condition is true, and else handles the other case.
~~~
if ($score >= 50) { echo "Pass"; } else { echo "Fail"; }
~~~
# Repeating work
A for loop repeats a set number of times. A while loop repeats as long as its condition stays true.
~~~
for ($i = 0; $i < 5; $i++) { echo $i; }
~~~
`, 'for ($i = 0; $i < 5; $i++)',
      T('check', 'Use a for loop to print the numbers 0 to 4.', { 'loop.php': '<?php\n  // write your code below\n?>\n' },
        [['for[ ]*[(]', 'Write a for loop'], ['echo', 'Echo inside the loop']], '01234')),
    L('Forms with PHP', 15, `
# Receiving form data
An HTML form sends its fields to a PHP file. With method POST, the values arrive in the $_POST array, keyed by each field name.
~~~
<form action="register.php" method="POST">
  Name: <input type="text" name="name">
  Age: <input type="number" name="age">
  <input type="submit">
</form>
~~~
~~~
$name = $_POST['name'];
echo "Name: " . $name;
~~~
`, 'Read the field with $_POST["name"].',
      T('check', 'Read the name field from the form and print it.', { 'register.php': '<?php\n  // write your code below\n?>\n' },
        [['[$]_POST', 'Use $_POST'], ['echo', 'Print the value']], 'Name: Sara')),
    L('MySQL Database Basics', 15, `
# Database vocabulary
A database is an organised collection of data. A table holds rows (records) and columns (fields). A primary key uniquely identifies each record. SQL is the language used to talk to the database.
~~~
CREATE DATABASE studentDB;
CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50),
  age INT
);
~~~
Use phpMyAdmin or run SQL commands to create them.
`, 'The table needs a PRIMARY KEY column.',
      T('check', 'Write the SQL that creates a students table with id, name and age.', { 'create.sql': '-- write your SQL below\n' },
        [['CREATE[ ]+TABLE[ ]+students', 'CREATE TABLE students'], ['PRIMARY[ ]+KEY', 'Add a PRIMARY KEY']], 'Table students created.')),
    L('Student Registration Form', 20, `
# The goal
Build a form that saves a registration number and a student name into MySQL, then tells the user what happened.
# Steps
Create the database and table, design the HTML form, handle the submitted form in PHP, and show a success or error message.
~~~
$con = mysqli_connect('localhost', 'root', '', 'sher');
if (isset($_POST['btn'])) {
  if (empty($_POST['dd']) || empty($_POST['sname'])) {
    echo "Please fill all fields";
  } else {
    $res = mysqli_query($con, "insert into stud values(...)");
  }
}
~~~
mysqli_connect opens the connection, isset checks the Save button was pressed, empty validates the fields, and mysqli_query runs the SQL.
> In real projects use prepared statements so user input cannot break or attack your SQL.
`, 'You need mysqli_connect, isset and mysqli_query.',
      T('check', 'Write the three key PHP steps: connect, check the button, run a query.', { 'save.php': '<?php\n  // write your code below\n?>\n' },
        [['mysqli_connect', 'Connect with mysqli_connect'], ['isset[ ]*[(]', 'Check the button with isset'], ['mysqli_query', 'Run the query with mysqli_query']], 'Registered successfully')),
    L('Course Registration & Allocation', 20, `
# Course registration module
A second form collects a course code and course name. If a field is empty, a JavaScript alert asks the user to fill everything in. Otherwise the row is inserted into the course table and a success message appears.
# Course allocation module
This module reads students and courses from three tables: students, courses and an allocation table. Two dropdown lists let the user pick a student and a course. Submitting the form inserts the pair into the allocation table and shows a success message.
@phpflow
> Reading lists from the database, then writing the chosen pair back, is the pattern behind most admin panels.
`, 'Which table receives the chosen pair?'),
  ],
};
