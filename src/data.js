import { LESSONS } from './content';
import { EXTRA, FULL } from './courses';

// cat = category chip. kw = extra words the search also understands.
export const COURSES = [
 { id:'python', name:'Python', lvl:'Beginner', cat:'Data Science', g:['#3ddc84','#1b8f5a'], d:'Learn programming fundamentals: variables, conditions, loops, data structures and functions.', kw:'programming loops functions lists dictionary basics' },
 { id:'numpy', name:'NumPy', lvl:'Beginner', cat:'Data Science', g:['#4facfe','#00c6ff'], d:'Work with fast numerical arrays: shapes, maths, indexing and statistics.', kw:'arrays numbers maths matrix scientific' },
 { id:'sql', name:'SQL', lvl:'Beginner', cat:'Data Science', g:['#6a5cff','#c04bff'], d:'Create, query and manage relational databases: SELECT, WHERE, GROUP BY, INSERT, UPDATE, DELETE.', kw:'database query tables select data' },
 { id:'pandas', name:'Data Analysis', lvl:'Beginner', cat:'Data Science', g:['#ffd86b','#ff8c42'], d:'Understand data analytics: types, collection, cleaning, big data and visualization.', kw:'analytics analyst statistics charts visualization big data cleaning' },
 { id:'html', name:'HTML', lvl:'Beginner', cat:'Web Development', g:['#9fd8ff','#6aa87a'], d:'Create your first website with HTML and learn how web apps work.', kw:'web website tags frontend architecture' },
 { id:'css', name:'CSS', lvl:'Beginner', cat:'Web Development', g:['#ffc2f0','#8fd3ff'], d:'Style pages with selectors, units, padding, margin and flexbox.', kw:'style design layout selectors units margin padding flexbox' },
 { id:'js', name:'JavaScript', lvl:'Beginner', cat:'Web Development', g:['#ff9a8b','#6a4c93'], d:'Add behaviour to pages: variables, functions, the DOM, events and async code.', kw:'dom events async script frontend' },
 { id:'php', name:'PHP & MySQL', lvl:'Intermediate', cat:'Web Development', g:['#6a82fb','#fc5c7d'], d:'Build server-side pages with XAMPP, PHP forms and a MySQL database.', kw:'server backend xampp apache forms registration database' },
 { id:'mobile', name:'Mobile App Development', lvl:'Intermediate', cat:'Mobile Application Development', g:['#11998e','#38ef7d'], d:'Build Android and iOS apps with React Native and Expo: components, styling, navigation, hooks and APIs.', kw:'react native expo android ios app navigation hooks api mobile' },
 { id:'aifund', name:'Artificial Intelligence', lvl:'Intermediate', cat:'AI', g:['#4776e6','#8e54e9'], d:'AI basics, search (BFS, DFS, A*, Minimax), intelligent agents, OOP and Prolog.', kw:'ai search agents prolog bfs dfs minimax logic' },
 { id:'ml', name:'Machine Learning', lvl:'Intermediate', cat:'AI', g:['#00c6ff','#7b2ff7'], d:'Teach computers to learn from data, then see how ML systems are built and run.', kw:'model training data pipeline mlops prediction' },
 { id:'ai', name:'AI Pair Programming', lvl:'Intermediate', cat:'AI', g:['#1b1464','#5b2cff'], d:'How AI code generators like Copilot work as a coding partner, and what research says.', kw:'copilot code generation assistant pair programming' },
 { id:'cs', name:'Computer Science', lvl:'Beginner', cat:'Computer Science', g:['#56ab2f','#a8e063'], d:'Logic, proofs, probability, computation, data representation and high performance computing.', kw:'logic math theory algorithms binary proofs computation' },
 { id:'game', name:'Game Development', lvl:'Beginner', cat:'Game Development', g:['#f7b733','#fc4a1a'], d:'How games are designed, planned, built and shipped: GDD, TDD, scope and releases.', kw:'games design production planning unity' },
];
export const CATS = ['Popular', 'AI', 'Web Development', 'Data Science', 'Computer Science', 'Game Development', 'Mobile Application Development'];

const EX = [['Introduction',10],['Basics',10],['Tools',10],['Exploring',15],['First Project',15],['Practice',20]];
const generic = (c) => [{
  title: `The World of ${c.name}`,
  ex: EX.map(([t, xp], i) => ({ title: t, xp,
    body: `Welcome to exercise ${i+1} of ${c.name}!\n\n${c.d}\n\nIn this exercise we focus on "${t}". Read through it, try it out on your own, then press Mark complete.`,
    hint: `Take it one step at a time. Re-read the instructions for "${t}" and try again.` })),
}];
export const level = (xp) => Math.floor(xp / 100) + 1;
export const rank = (xp) => (level(xp) < 6 ? 'Bronze' : 'Silver');

export const chapters = (c) => {
  const ex = FULL[c.id] || [...(LESSONS[c.id] || []), ...(EXTRA[c.id] || [])];
  return ex.length ? [{ title: `The World of ${c.name}`, ex }] : generic(c);
};

// ---- search: every word you type must appear in the name, description, category, keywords or a lesson title ----
const hay = {};
const haystack = (c) => hay[c.id] || (hay[c.id] = [c.name, c.d, c.cat, c.kw || '', c.lvl, ...chapters(c)[0].ex.map((e) => e.title)].join(' ').toLowerCase());
export const matchCourse = (c, query) => {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const h = haystack(c);
  return words.every((w) => h.includes(w));
};

export const PATHS = {
 'Programming fundamentals': { title:'Programming Fundamentals', sub:'Learn how to think like a programmer.', ids:['python','js','cs'],
   out:['Write programs with variables, loops and functions','Break big problems into small steps','Understand logic, binary and algorithms'] },
 'Building websites or webapps': { title:'Web Development', sub:'Build your own websites and web apps from scratch.', ids:['html','css','js','php'],
   out:['Structure pages with HTML and style them with CSS','Add interactivity with JavaScript','Save data with PHP and MySQL'] },
 'Analyzing data': { title:'Data Science', sub:'Turn raw numbers into answers.', ids:['python','pandas','sql','numpy'],
   out:['Clean and explore real datasets','Query databases with SQL','Summarize findings with arrays and charts'] },
 'Artificial Intelligence': { title:'Artificial Intelligence', sub:'Understand and build with AI.', ids:['aifund','ml','ai'],
   out:['Solve problems with search and agents','Understand how models learn from data','Use an AI pair programmer wisely'] },
 'Computer Science': { title:'Computer Science', sub:'Learn how computers really work.', ids:['cs','python','sql'],
   out:['Reason with logic and proofs','Understand computation and data representation','Solve problems with clean steps'] },
 'Game development': { title:'Game Development', sub:'Make games you can play and share.', ids:['game','js','python'],
   out:['Plan and design a game with a GDD','Estimate, track and ship a project','Control scope and feature creep'] },
 'Mobile app development': { title:'Mobile App Development', sub:'Build apps for Android and iOS.', ids:['mobile','js','html'],
   out:['Build screens with React Native components','Style, navigate and manage state with hooks','Connect your app to a backend API'] },
 'Something else': { title:'Popular Picks', sub:'A friendly mix to start exploring.', ids:['python','html','js'],
   out:['Try a bit of everything','Find the topic you enjoy most','Earn your first XP and badges'] },
};
