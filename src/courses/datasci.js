import { L, T } from './dsl';
const ST = 'id | name | age\n1  | Ava  | 12\n2  | Ben  | 14\n3  | Cleo | 11';
const q = (goal, checks, out) => T('sql', goal, { 'query.sql': '-- Table students(id, name, age)\n-- write your query below\n' }, checks, out);

export const EXTRA_DS = {
  python: [
    L('Conditional Statements', 15, `
# Choosing a path
Conditional statements run different code depending on a condition. Python has if, if-else and if-elif-else. Indentation (the spaces at the start of a line) shows which lines belong to which branch.
~~~
age = 17
if age >= 18:
    print("Adult")
elif age >= 13:
    print("Teen")
else:
    print("Child")
~~~
`, 'Do not forget the colon after each condition.',
      T('check', 'Write an if-else that prints Adult or Child depending on age.', { 'main.py': 'age = 20\n# write your code below\n' },
        [['if[ ].+:', 'Write an if with a colon'], ['else[ ]*:', 'Add an else branch'], ['print', 'Print a message']], 'Adult')),
    L('Loops', 15, `
# Repeating code
A for loop walks through a sequence such as range(5), a list or a string. A while loop repeats while its condition stays true. break stops a loop early and continue skips to the next round. Loops can be nested, and a loop can even have an else clause.
~~~
for i in range(1, 6):
    print(i)
n = 3
while n > 0:
    n -= 1
~~~
@loop
`, 'range(1, 6) gives 1 to 5.',
      T('check', 'Use a for loop with range to print 1 to 5.', { 'main.py': '# write your code below\n' },
        [['for[ ]+[a-z]+[ ]+in[ ]+range', 'Write for ... in range(...)'], ['print', 'Print inside the loop']], '1\n2\n3\n4\n5')),
    L('Lists, Tuples, Dicts & Sets', 15, `
# Four containers
A list is ordered and changeable. A tuple is ordered but fixed. A set holds unique items. A dictionary stores key-value pairs. You can index, slice, add, remove and loop through them.
~~~
marks = [70, 85, 92]
marks.append(60)
info = {"name": "Sam", "age": 19}
unique = {1, 2, 2, 3}
~~~
`, 'append adds to the end of a list.',
      T('check', 'Make a list of marks and add one more with append.', { 'main.py': '# write your code below\n' },
        [['[a-z]+[ ]*=[ ]*[[]', 'Create a list'], ['append[ ]*[(]', 'Use append']], '[70, 85, 92, 60]')),
    L('Functions', 15, `
# Reusable code
A function is defined with def. Parameters are the inputs, arguments are the real values you pass, and return sends a result back.
~~~
def square(n):
    return n * n
print(square(4))
~~~
`, 'def name(parameters): then return.',
      T('check', 'Define a function that returns the square of a number and call it.', { 'main.py': '# write your code below\n' },
        [['def[ ]+[a-z_]+[(]', 'Define a function with def'], ['return', 'Return a value'], ['print', 'Print the result']], '16')),
  ],
  sql: [
    L('SQL Theory', 10, `
# Four families of statements
SQL statements fall into groups. DDL (Data Definition Language) creates and changes structures such as tables. DML (Data Manipulation Language) works with the data: SELECT, INSERT, UPDATE and DELETE. DCL (Data Control Language) manages permissions. TCL (Transaction Control Language) handles COMMIT and ROLLBACK.
@sqlclauses
`, 'Which family contains SELECT?'),
    L('Creating & Changing Tables', 15, `
# DDL in action
CREATE builds a database object such as a table. ALTER changes an existing one, for example by adding a column. DROP deletes an object.
~~~
CREATE TABLE sales (purchase_number INT);
ALTER TABLE sales ADD COLUMN date_of_purchase DATE;
DROP TABLE sales;
~~~
`, 'CREATE TABLE name (column type);',
      T('sql', 'Create a table called sales with an INT column purchase_number.', { 'query.sql': '-- write your query below\n' }, [['CREATE[ ]+TABLE[ ]+sales', 'CREATE TABLE sales'], ['purchase_number[ ]+INT', 'Add purchase_number INT']], 'Table sales created.')),
    L('WHERE, AND & OR', 15, `
# Filtering rows
WHERE keeps only the rows that match. AND needs both conditions, OR needs either one. AND is evaluated before OR, so use brackets when you mix them.
~~~
SELECT * FROM students
WHERE age > 11 AND name = 'Ben';
~~~
`, "Text values use single quotes.", q('Select students older than 11 whose name is Ben.', [['select[\\s\\S]*from[ ]+students', 'SELECT ... FROM students'], ['where[\\s\\S]*and', 'Combine two conditions with AND']], 'id | name | age\n2  | Ben  | 14')),
    L('Wildcards, BETWEEN & LIMIT', 15, `
# Searching patterns
LIKE with % matches any number of characters, and _ matches exactly one. BETWEEN ... AND ... checks a range. LIMIT keeps only the first rows.
~~~
SELECT * FROM students WHERE name LIKE 'C%';
SELECT * FROM students WHERE age BETWEEN 11 AND 13;
SELECT * FROM students LIMIT 2;
~~~
`, "Try LIKE 'C%'", q('Find students whose name starts with C.', [['like[ ]*.c%', "Use LIKE 'C%'"]], 'id | name | age\n3  | Cleo | 11')),
    L('NULL, DISTINCT & Aggregates', 15, `
# Missing values and summaries
IS NULL and IS NOT NULL test for missing data. DISTINCT removes duplicates. Aggregate functions summarise many rows into one value: COUNT, SUM, AVG, MIN and MAX.
~~~
SELECT COUNT(*) FROM students;
SELECT AVG(age) FROM students;
~~~
`, 'COUNT(*) counts rows.', q('Count how many students there are.', [['count[ ]*[(]', 'Use COUNT(...)']], 'COUNT(*)\n3')),
    L('GROUP BY & HAVING', 20, `
# Grouping
GROUP BY puts rows with the same value together so aggregates are calculated per group. WHERE filters rows before grouping, while HAVING filters the groups after.
~~~
SELECT age, COUNT(*) FROM students
GROUP BY age HAVING COUNT(*) >= 1;
~~~
@sqlclauses
`, 'GROUP BY goes after WHERE.', q('Count students for each age.', [['group[ ]+by[ ]+age', 'GROUP BY age'], ['count[ ]*[(]', 'Use COUNT']], 'age | COUNT(*)\n11  | 1\n12  | 1\n14  | 1')),
    L('INSERT', 15, `
# Adding rows
INSERT INTO adds a new record. You can also copy rows from another table with INSERT INTO ... SELECT.
~~~
INSERT INTO students VALUES (4, 'Dina', 13);
~~~
`, 'Values go in the same order as the columns.', q('Insert a student with id 4, name Dina, age 13.', [['insert[ ]+into[ ]+students', 'INSERT INTO students'], ['values', 'Add VALUES']], '1 row inserted.')),
    L('UPDATE, COMMIT & ROLLBACK', 15, `
# Changing data safely
UPDATE changes existing rows, and WHERE decides which ones. COMMIT saves your changes permanently, while ROLLBACK undoes everything since the last commit.
~~~
UPDATE students SET age = 15 WHERE id = 1;
COMMIT;
~~~
> Always include WHERE, or every row changes.
`, 'UPDATE table SET column = value WHERE ...', q('Set the age of student 1 to 15.', [['update[ ]+students', 'UPDATE students'], ['set[ ]+age', 'SET age'], ['where', 'Add a WHERE']], '1 row updated.')),
    L('DELETE, DROP & TRUNCATE', 15, `
# Three ways to remove
DELETE removes chosen rows and can be rolled back. TRUNCATE empties a whole table quickly but keeps its structure. DROP removes the table itself.
~~~
DELETE FROM students WHERE id = 3;
~~~
`, 'DELETE FROM table WHERE ...', q('Delete the student with id 3.', [['delete[ ]+from[ ]+students', 'DELETE FROM students'], ['where', 'Add a WHERE']], '1 row deleted.')),
  ],
};

export const FULL_DS = {
  numpy: [
    L('What is NumPy?', 10, `
# Fast numbers
NumPy is a Python package for fast numerical work. Its main object is the array, a grid of values of the same type. Arrays use less memory than lists and let you do maths on all values at once.
~~~
import numpy as np
a = np.array([1, 2, 3])
~~~
`, 'The usual nickname is np.'),
    L('Array Basics', 15, `
# Creating arrays
Make arrays with np.array, np.zeros, np.ones and np.arange. Useful attributes are shape (size in each direction), ndim (number of dimensions) and dtype (value type).
~~~
b = np.array([[1, 2], [3, 4]])
print(b.shape)   # (2, 2)
~~~
`, 'shape tells you rows and columns.',
      T('check', 'Create a 2x3 array and print its shape.', { 'main.py': 'import numpy as np\n# write your code below\n' }, [['np[.]array[ ]*[(]', 'Use np.array'], ['[.]shape', 'Print the shape']], '(2, 3)')),
    L('Math & Indexing', 15, `
# Element-wise operations
Operators act on every element, so a + 1 adds one to each value. Slicing works like lists: a[1:3] gives items 1 and 2, and a[a > 2] keeps only values greater than 2.
~~~
a = np.array([1, 2, 3, 4])
print(a * 2)      # [2 4 6 8]
print(a[a > 2])   # [3 4]
~~~
`, 'a[a > 2] filters by a condition.',
      T('check', 'Double every value of an array and keep values above 2.', { 'main.py': 'import numpy as np\na = np.array([1, 2, 3, 4])\n# write your code below\n' }, [['a[ ]*[*][ ]*2', 'Multiply by 2'], ['a[[]a[ ]*>', 'Filter with a[a > ...]']], '[2 4 6 8]\n[3 4]')),
    L('Statistics & Reshape', 15, `
# Summaries
Functions like mean, sum, max, min and std summarise an array. reshape changes its shape without changing the data.
~~~
a = np.arange(6)
print(a.mean())
print(a.reshape(2, 3))
~~~
`, 'reshape(rows, columns).',
      T('check', 'Compute the mean of an array and reshape it.', { 'main.py': 'import numpy as np\na = np.arange(6)\n# write your code below\n' }, [['mean', 'Use mean'], ['reshape[ ]*[(]', 'Use reshape']], '2.5\n[[0 1 2]\n [3 4 5]]')),
  ],
  pandas: [
    L('What is Data Analytics?', 10, `
# From raw data to decisions
Data analytics turns raw data into useful insight. It uses tools and processes to find trends, solve problems and improve decisions. Descriptive analysis summarises data, for example average sales per employee, and answers what happened.
# Why it matters
Analytics shows market trends, helps design products, cuts costs, improves customer service and sharpens marketing.
@dataloop
`, 'Name one reason businesses use data.'),
    L('Types of Analytics', 15, `
# Four kinds of questions
Descriptive analytics asks what happened. Diagnostic analytics asks why it happened. Predictive analytics asks what is likely to happen next. Prescriptive analytics asks what we should do about it.
> Business analytics focuses on the business decision, data analytics on the data itself.
`, 'Which type predicts the future?'),
    L('Data Roles', 10, `
# Who does what
A data analyst studies existing data and explains it. A data engineer builds the systems that collect, store and move data. A data scientist builds models and predictions from data. They often work together on one project.
`, 'Who builds the data pipelines?'),
    L('Structured & Unstructured Data', 15, `
# Digital data
Structured data fits neatly into rows and columns, like a table of customers. Unstructured data has no fixed shape: text, images, audio, video and social media posts. Most of the world's data is unstructured, so special tools are needed to analyse it.
@table
`, 'Which kind fits in a table?'),
    L('Data Collection', 15, `
# Gathering data
Data can come from surveys, sensors, logs, databases, websites and APIs. Good collection plans decide what to measure, how often and from where, and they respect privacy.
`, 'Name two sources of data.'),
    L('Data Cleaning & Preprocessing', 20, `
# Make data ready
Raw data is messy. Preprocessing fixes missing values, removes duplicates, corrects wrong entries, handles outliers and puts values into consistent formats. Clean data leads to trustworthy results.
~~~
Missing   -> fill or remove
Duplicate -> remove
Outlier   -> check, then keep or remove
~~~
@pipeline
`, 'Fix missing values and duplicates first.'),
    L('Big Data', 15, `
# Very large data
Big data means data too large or fast for normal tools. It is often described by volume (how much), velocity (how fast it arrives) and variety (how many formats). It needs distributed storage and processing.
`, 'Volume, velocity and variety.'),
    L('Data Visualization', 20, `
# Pictures of data
Charts help people see patterns quickly. Bar charts compare categories, line charts show change over time, pie charts show shares of a whole and scatter plots show relationships between two numbers. Pick the simplest chart that answers the question.
@chart
> A good chart has a clear title, labelled axes and no clutter.
`, 'Use a line chart for time.'),
  ],
};
