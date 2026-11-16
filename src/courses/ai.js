import { L, T } from './dsl';
export const FULL_AI = {
  aifund: [
    L('What is Artificial Intelligence?', 10, `
# Machines that act smart
Artificial Intelligence (AI) is about building systems that perform tasks which normally need human intelligence: understanding language, recognising images, planning and learning. Programming is the tool that turns those ideas into working systems.
# A short history
Early ideas came from logic and the question of whether machines can think. AI became a research field in the 1950s, went through hopeful periods and slowdowns, and grew rapidly with machine learning, more data and faster computers.
@agent
`, 'AI needs both ideas and programming.'),
    L('Search Problems at a Glance', 10, `
# Finding a path
Many AI problems can be turned into search: start from an initial state, try moves, and look for a goal state. Different algorithms explore the possibilities in different orders. We will meet BFS, DFS, A* and Minimax.
@search
`, 'Search explores states until it finds a goal.'),
    L('Breadth-First Search (BFS)', 15, `
# Layer by layer
BFS starts at one node and visits all its neighbours first, then their neighbours, and so on. It uses a queue (first in, first out) and always finds the shortest path in an unweighted graph.
~~~
from collections import deque
def bfs(graph, start):
    seen, queue = {start}, deque([start])
    while queue:
        node = queue.popleft()
        for nxt in graph[node]:
            if nxt not in seen:
                seen.add(nxt); queue.append(nxt)
~~~
`, 'A queue gives layer-by-layer order.',
      T('check', 'Write a BFS that uses a deque and popleft.', { 'main.py': 'from collections import deque\n# write your code below\n' }, [['deque', 'Use a deque'], ['popleft', 'Take from the front with popleft']], 'A B C D E')),
    L('Depth-First Search (DFS)', 15, `
# Go deep first
DFS follows one path as far as it can, then backs up and tries another. It uses a stack, or recursion, and needs less memory than BFS but does not guarantee the shortest path.
~~~
def dfs(graph, node, seen=None):
    seen = seen or set()
    seen.add(node)
    for nxt in graph[node]:
        if nxt not in seen:
            dfs(graph, nxt, seen)
~~~
`, 'DFS can use recursion.',
      T('check', 'Write a recursive DFS function.', { 'main.py': '# write your code below\n' }, [['def[ ]+dfs', 'Define dfs'], ['dfs[ ]*[(].*[)]', 'Call dfs recursively']], 'A B D E C')),
    L('A* Search', 15, `
# Smarter search
A* is an informed search. It scores each node with f = g + h, where g is the cost so far and h is a guess of the cost still to go. It picks the lowest f next, so it heads toward the goal and finds the shortest path when h never overestimates.
`, 'f = g + h'),
    L('Minimax for Games', 15, `
# Two players taking turns
In a turn-based game, Minimax assumes you try to maximise your score while the opponent tries to minimise it. It explores the game tree and picks the move with the best guaranteed outcome.
@search
`, 'One player maximises, the other minimises.'),
    L('Intelligent Agents', 15, `
# Perceive and act
An agent senses its environment through sensors (percepts) and acts through actuators. A simple reflex agent follows condition-action rules: if the current percept matches a condition, perform an action. The vacuum-cleaner world is the classic example: if the square is dirty, suck; otherwise move.
@agent
~~~
def vacuum_agent(location, status):
    if status == "Dirty":
        return "Suck"
    return "Right" if location == "A" else "Left"
~~~
`, 'Dirty means suck.',
      T('check', 'Write a reflex agent function that returns Suck when the square is dirty.', { 'main.py': '# write your code below\n' }, [['def[ ]+[a-z_]+[(]', 'Define a function'], ['Dirty', 'Check for Dirty'], ['Suck', 'Return Suck']], 'Suck')),
    L('Classes & Objects', 15, `
# OOP for AI parts
Object-oriented programming models things as classes. A class describes attributes and methods, an object is one real instance. __init__ is the constructor and self refers to the current object. AI components such as agents and environments are naturally written as classes.
~~~
class Agent:
    def __init__(self, name):
        self.name = name
    def act(self):
        return self.name + " acts"
~~~
`, '__init__ sets up the object.',
      T('check', 'Define a class with an __init__ method and one more method.', { 'main.py': '# write your code below\n' }, [['class[ ]+[A-Za-z]+', 'Define a class'], ['__init__', 'Add __init__'], ['self', 'Use self']], 'Agent acts')),
    L('Logic Programming with Prolog', 20, `
# Facts, rules, queries
Prolog is a declarative language used for knowledge and reasoning. You write facts (things that are true), rules (how new facts follow) and queries (questions), then the system searches for answers. Programs are run in SWI-Prolog.
~~~
parent(tom, bob).
parent(bob, ann).
grandparent(X, Z) :- parent(X, Y), parent(Y, Z).
?- grandparent(tom, ann).
~~~
`, 'A rule uses :- and commas mean AND.',
      T('check', 'Write one fact and one rule.', { 'family.pl': '% write your code below\n' }, [['[a-z]+[(][a-z]+,[ ]*[a-z]+[)][.]', 'Write a fact'], [':-', 'Write a rule with :-']], 'true.')),
  ],
  ml: [
    L('Machine Learning Basics', 10, `
# Learning from examples
Machine learning (ML) lets a program learn patterns from data instead of following hand-written rules. A dataset is made of rows. Features are the input columns, and the label is the answer we want to predict. Parameters are learned by the model, hyperparameters are chosen by us before training.
`, 'Features are inputs, labels are answers.'),
    L('Preprocessing Data', 15, `
# Prepare before training
Handle missing values by filling or removing them. Encode categories such as colour into numbers. Scale features so large numbers do not dominate small ones.
@pipeline
`, 'Fix, encode, then scale.'),
    L('Train, Test & Predict', 15, `
# A simple pipeline
Split the data into a training set (to learn from) and a test set (to judge the model on unseen data). Train the model with fit and make predictions with predict.
~~~
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
model.fit(X_train, y_train)
pred = model.predict(X_test)
~~~
`, 'Never test on training data.',
      T('check', 'Split data, fit a model and predict.', { 'main.py': '# write your code below\n' }, [['train_test_split', 'Use train_test_split'], ['[.]fit[ ]*[(]', 'Call fit'], ['[.]predict[ ]*[(]', 'Call predict']], 'Predictions ready')),
    L('Evaluating a Model', 15, `
# How good is it?
Accuracy is the share of correct predictions. A confusion matrix shows the true positives, true negatives, false positives and false negatives, so you can see which mistakes the model makes.
~~~
from sklearn.metrics import accuracy_score, confusion_matrix
print(accuracy_score(y_test, pred))
~~~
`, 'Accuracy alone can hide problems.',
      T('check', 'Print the accuracy score.', { 'main.py': '# write your code below\n' }, [['accuracy_score', 'Use accuracy_score'], ['print', 'Print it']], '0.92')),
    L('Overfitting & Underfitting', 15, `
# Too tight, too loose
An overfit model memorises the training data and fails on new data: training score high, test score low. An underfit model is too simple and does badly on both. Compare training and test results to spot each case.
`, 'Big gap between train and test = overfitting.'),
    L('From Code to Data-Defined Behaviour', 15, `
# ML systems thinking
In classic software, people write the rules. In ML systems, behaviour comes from data, so data quality matters as much as code. ML systems can also fail silently: they keep running and give plausible but wrong answers. That is why we monitor them.
@pipeline
`, 'Data decides behaviour.'),
    L('Data Engineering & Deployment', 15, `
# Collect, serve, scale
Data engineering builds the pipelines that collect, clean and store data. Models can then be deployed in the cloud for raw power, at the edge for low delay and privacy, on mobile for offline use, or on tiny devices for always-on sensing. Pick the setting that matches the limits of your product.
@arch
`, 'Edge means close to the user.'),
    L('MLOps & Responsible Engineering', 15, `
# Keep models healthy
MLOps covers serving, monitoring and updating models over time, with automation so releases are safe and repeatable. Responsible engineering asks about fairness, privacy, safety and environmental cost before and after launch.
`, 'Monitoring never stops.'),
  ],
  ai: [
    L('What is Pair Programming?', 10, `
# Two minds, one task
Pair programming has two developers share one workstation. One, the driver, types the code. The other, the navigator, reviews each line and thinks about the bigger picture. They swap roles often. It is popular because it produces good quality software in a short time.
`, 'Driver types, navigator reviews.'),
    L('AI Code Generation Tools', 10, `
# An AI partner
Code generation tools suggest or write code from your context. GitHub Copilot is described as an AI pair programmer trained on huge amounts of public code. It is powered by a language model family called Codex, which also helps explain code and propose fixes. Other models exist, some open-source, though most perform below Codex on benchmarks.
@agent
`, 'Copilot works inside your editor.'),
    L('Why Combine AI and Pairing?', 10, `
# The idea
Code generators can save time and cost, and pair programming can raise quality. Combining them means the AI can play part of the driver or navigator role while a human keeps the judgement. The question is how well that works today.
`, 'AI can take a role in the pair.'),
    L('A Systematic Mapping Study', 15, `
# How the research was done
A mapping study organises existing research instead of running a new experiment. The author defined research questions, searched databases with a query, applied inclusion and exclusion criteria to titles, abstracts and full texts, and ended with 25 relevant studies sorted into nine dimensions such as methods, technologies, goals and tasks.
@pipeline
`, 'Search, filter, then classify.'),
    L('What the Studies Show', 15, `
# Findings
Research on AI-assisted programming has grown over the years and covers tasks such as code completion, bug fixing and generating programs from descriptions. In one study the model fixed correct solutions for about 45% of the problems in a bug-fixing benchmark, which shows real promise but also clear limits.
> Treat AI suggestions as drafts: read, test and understand them.
`, 'Promising, not perfect.'),
    L('Gaps & Using AI Well', 15, `
# Open problems
The study points to gaps: few real-world experiments, little work on collaboration between a person and an AI, and open questions about trust and quality. As a learner, ask the AI for hints, review every answer, write tests and keep understanding the code yourself.
`, 'Review and test everything.'),
  ],
};
