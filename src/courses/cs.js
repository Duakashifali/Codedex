import { L, T } from './dsl';
export const FULL_CS = {
  cs: [
    L('Think Like a Computer Scientist', 10, `
# What is a program?
A program is a sequence of instructions. Almost every program is built from a few ideas: input, output, math, conditional execution and repetition. Programming is the art of breaking a big problem into steps small enough for a computer.
# Three kinds of mistakes
Syntax errors break the rules of the language. Runtime errors happen while the program runs. Semantic errors run fine but do the wrong thing, and they are the hardest to find.
`, 'Which error produces wrong answers silently?'),
    L('Logic: Propositions', 15, `
# True or false
A proposition is a statement that is either true or false. We combine them with NOT, AND, OR, implication and equivalence. Truth tables list every combination of inputs and the result.
~~~
p  q | p AND q | p OR q | p -> q
T  T |    T    |   T    |   T
T  F |    F    |   T    |   F
F  T |    F    |   T    |   T
F  F |    F    |   F    |   T
~~~
Logic is the foundation of programming conditions, circuits and proofs.
`, 'p implies q is false only when p is true and q is false.'),
    L('Proofs & Induction', 15, `
# Showing something is always true
A proof is a convincing argument built from definitions and earlier facts. The well-ordering principle says every non-empty set of positive integers has a smallest element. Induction proves a statement for all numbers: prove it for the first case, then prove that if it holds for n it holds for n + 1.
@loop
`, 'Base case, then step.'),
    L('Sets, Graphs & Structures', 15, `
# Mathematical building blocks
Sets hold collections of items, and relations connect them. A directed graph is a set of nodes with arrows, and many real systems are graphs: networks, maps and dependencies. Simple graphs, partial orders and planar graphs describe different structures.
@search
`, 'Nodes connected by edges.'),
    L('Counting & Probability', 15, `
# How many, how likely
Counting rules tell us how many arrangements or choices exist. Probability measures how likely an event is, from 0 to 1. Conditional probability updates the chance when we know something new, and random variables turn outcomes into numbers whose average and spread we can study.
`, 'Probability is between 0 and 1.'),
    L('What is Computation?', 20, `
# Defining computation
Theoretical computer science asks what can be computed and how fast. Everything is represented as bits, and simple models such as Boolean circuits and machines with loops can compute functions. Surprisingly, some problems cannot be solved by any program at all, a result called uncomputability.
@layers
`, 'Some problems have no algorithm.'),
    L('Data Representation & Algorithms', 15, `
# Bits and steps
Computers store everything as binary numbers: text, pictures and sound are all patterns of 0 and 1. An algorithm is a precise step-by-step method, and abstract data types describe what a structure does without saying how it is built.
~~~
5 in binary = 101   (4 + 0 + 1)
~~~
`, 'Binary uses only 0 and 1.',
      T('check', 'Write the binary of 5.', { 'answer.txt': '' }, [['101', 'Binary 5 is 101']], '101')),
    L('Computer Science Unplugged', 10, `
# Learning without a computer
Unplugged activities teach core ideas with cards, string and games instead of screens. Examples include counting in binary with cards, measuring how much information a message holds, and acting out how a computer follows instructions.
`, 'You can learn CS with cards.'),
    L('High Performance Computing', 15, `
# Many computers, one job
High performance computing solves huge problems by using many processors together. A cluster is a group of connected computers working as one system, with middleware, scheduling and tools for sharing resources, security and reliability.
@layers
`, 'Clusters share the work.'),
  ],
  game: [
    L('Why Make Games?', 10, `
# Reasons
People make games to share a dream, to teach, and to entertain different tastes. Genres include puzzle and parlor games, military and sports simulations, and role-playing games. Making money matters too, but it works best alongside a love of the craft.
`, 'Games can teach.'),
    L('What Makes Game Development Hard?', 10, `
# Planning and profit
Game development is hard because projects are big and few titles earn a profit. The scope of the game has to match its budget. A feature storm, where ideas keep piling in, can sink a project, so a plan is essential.
@devcycle
`, 'Plan first.'),
    L('Game Project Survival Test', 10, `
# Honest questions first
Before starting, test whether the project can survive: Is there a clear plan? Is the team able and organised? Is the scope realistic? Are there funds to finish? Answering honestly early saves a lot of pain later.
`, 'Be honest about the scope.'),
    L('What Is a Game Made Of?', 15, `
# The ingredients
A game combines art, sound, code, design, story and testing. Each part needs skilled people and time, and they must fit together into one experience. Game development is also software development, so good engineering habits apply.
`, 'Many skills, one product.'),
    L('Business Context First', 10, `
# Know the market
Decide who the players are, what platform you target, how you will sell and what the game must earn. These business choices shape the design and the schedule.
`, 'Money shapes scope.'),
    L('Key Design Elements', 15, `
# Design thinking
Core design elements include the goal, the rules, the challenge, the feedback and the reward. A clear core idea keeps every feature pointed in the same direction.
@gameloop
`, 'Goal, rules, challenge, reward.'),
    L('The Game Design Document', 15, `
# GDD
The Game Design Document describes what the game is: its story, characters, levels, rules, controls and look. It is the shared reference so the whole team builds the same game. Start with a short vision statement and grow the detail over time.
`, 'The GDD says what the game is.'),
    L('The Technical Design Document', 15, `
# TDD
The Technical Design Document explains how the game will be built: the engine, tools, architecture and data. Diagrams such as UML help explain structure. It turns the design into engineering tasks.
@arch
`, 'The TDD says how it is built.'),
    L('Plan, Estimate & Track', 15, `
# Project management
A project plan lists tasks, owners and dates. Time estimates are always uncertain, so break big tasks into small ones. Task tracking and measuring progress show whether you are on schedule so you can react early.
@devcycle
`, 'Small tasks estimate better.'),
    L('Feature Creep & Shipping', 20, `
# Finish the game
Feature creep is the slow growth of scope. Control it by deciding what is in and out and sticking to it. Releases move from alpha (features in, many bugs) to beta (feature complete, fixing bugs) to the final version. After release, point releases add content while patches fix problems.
@devcycle
`, 'Say no to extra features.'),
    L('Careers & Outsourcing', 10, `
# Working in the industry
You can get into the game industry through portfolios, small projects and teamwork. Studios outsource music, voice, sound effects, writing, models and animation to specialists, so clear briefs and contracts are important. Fans can also produce valuable material.
`, 'Show your own work.'),
  ],
};
