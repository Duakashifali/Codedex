import { L, T } from './dsl';
export const FULL_MOBILE = {
  mobile: [
    L('Mobile Platforms & Approaches', 10, `
# Why mobile
Android holds roughly 70% of the global market and iOS about 28%. Both matter, so teams choose an approach.
# Native vs cross-platform
Native development builds a separate app for each platform with its own language. Cross-platform tools such as React Native let one JavaScript code base run on both.
@devcycle
> This course covers Android and iOS ideas, JavaScript and React basics, React Native UI, APIs and data, testing and a project.
`, 'Which approach shares one code base?'),
    L('JavaScript Essentials', 10, `
# One language everywhere
JavaScript runs in the browser, on servers with Node.js, and in mobile apps through React Native. It can run only one task at a time on a single call stack, so slow work is handled with asynchronous patterns.
@loop
`, 'JavaScript runs one task at a time.'),
    L('Destructuring & Spread', 15, `
# Unpacking values
Destructuring pulls values out of arrays or objects into variables. The spread operator copies or extends them.
~~~
const { a, b } = { a: 1, b: 2 };
const [y, z] = [1, 2, 3];
const person2 = { ...person, salary: 0 };
const more = [...names, 'Laiba'];
~~~
`, 'Curly braces for objects, square brackets for arrays.',
      T('check', 'Destructure name and age from a person object and print them.', { 'app.js': 'const person = { name: "Aiza", age: 16 };\n// write your code below\n' },
        [['const[ ]*[{][^}]*name', 'Destructure with curly braces'], ['console[.]log', 'Print the values']], 'Aiza 16')),
    L('Setting Up with Expo', 10, `
# Expo
Expo is a framework around React Native that gives you tools for development, testing and building. It removes most of the setup pain, which is ideal for beginners and fast prototypes. Expo Snack lets you try code in the browser.
~~~
npx create-expo-app myApp
cd myApp
npx expo start
~~~
Scan the QR code with Expo Go on your phone to see the app. Always check the official React Native docs for props and platform differences.
`, 'The start command is npx expo start.'),
    L('React Fundamentals', 15, `
# Components
A component is a JavaScript function that describes what should appear on screen. Components are the building blocks of React, written with JSX (HTML-like syntax inside JavaScript).
~~~
import React from 'react';
import { Text } from 'react-native';
const Cat = () => <Text>Hello, I am your cat!</Text>;
export default Cat;
~~~
React Native is built on React, so learning components, JSX, props and state first makes everything else easier.
`, 'A component returns JSX.',
      T('check', 'Write a Cat component that returns a Text element.', { 'Cat.js': "import React from 'react';\nimport { Text } from 'react-native';\n// write your code below\n" },
        [['(const|function)[ ]+Cat', 'Define a Cat component'], ['<Text', 'Return a <Text> element']], 'Hello, I am your cat!')),
    L('Props & State', 15, `
# Props
Props are inputs passed into a component, so one component can be reused with different data.
# State
State is memory inside a component. When it changes, React redraws the screen.
~~~
const [count, setCount] = useState(0);
<Button title="Add" onPress={() => setCount(count + 1)} />
~~~
`, 'useState returns a value and a setter.',
      T('check', 'Create a counter state with useState and update it on press.', { 'Counter.js': "import React, { useState } from 'react';\nimport { View, Text, Button } from 'react-native';\n// write your code below\n" },
        [['useState[ ]*[(]', 'Use useState'], ['onPress', 'Update it inside onPress']], 'Count goes up by 1 on each tap')),
    L('Styling Components', 15, `
# StyleSheet
Style values are written in JavaScript. fontSize sets text size, fontWeight makes it thicker, and color and backgroundColor change colors.
# Sizes and spacing
All dimensions are unitless and measured in density-independent pixels, so there is no px or em. Use marginTop, marginLeft, marginVertical and similar for spacing. overflow: 'hidden' clips children while 'scroll' lets them scroll.
~~~
const styles = StyleSheet.create({
  title: { fontSize: 24, color: 'teal', marginVertical: 8 },
});
~~~
`, 'Numbers have no units in React Native.',
      T('check', 'Create a StyleSheet with a title style.', { 'styles.js': "import { StyleSheet } from 'react-native';\n// write your code below\n" },
        [['StyleSheet[.]create', 'Use StyleSheet.create'], ['fontSize', 'Set fontSize']], 'Large teal title')),
    L('Images, Fonts & Icons', 10, `
# Backgrounds and icons
ImageBackground works like Image and draws a picture behind its children. Set resizeMode to cover to fill the space.
# Fonts
iOS uses San Francisco and Android uses Roboto by default. You can add your own TTF or OTF files in assets/fonts, or install a Google Font package such as @expo-google-fonts/inter. OTF files are usually smaller.
`, 'Which prop makes the picture fill its box?'),
    L('Navigation', 20, `
# Moving between screens
React Navigation is the library used to move between screens.
~~~
npm install @react-navigation/native
npx expo install react-native-screens react-native-safe-area-context
~~~
Wrap the app in NavigationContainer, then use a native stack navigator to push and pop screens.
@navstack
# Passing data
Send data with navigation.navigate('Details', { id: 5 }) and read it with route.params on the next screen.
`, 'Wrap everything in NavigationContainer.',
      T('check', 'Navigate to a Details screen and pass an id.', { 'Home.js': '// write your code below\n' },
        [['navigation[.]navigate[ ]*[(]', 'Call navigation.navigate'], ['Details', 'Go to Details']], 'Details screen opens with id 5')),
    L('Hooks & Context', 20, `
# Component lifecycle
A component mounts when added to the screen, updates when props or state change, and unmounts when removed.
@lifecycle
# useEffect and useContext
useEffect runs code after rendering, such as loading data or cleaning up when leaving. useContext reads shared data from a provider so you do not pass props through every level. Shared styles can live in a styles.js file imported by many components.
~~~
useEffect(() => { loadData(); return () => cleanup(); }, []);
const theme = useContext(ThemeContext);
~~~
`, 'The empty array means: run once.',
      T('check', 'Use useEffect to log a message when the component mounts.', { 'Effect.js': "import React, { useEffect } from 'react';\n// write your code below\n" },
        [['useEffect[ ]*[(]', 'Use useEffect'], ['console[.]log', 'Log a message']], 'Mounted!')),
    L('Backend & APIs', 15, `
# What is a backend
The backend is the part of a system users never touch directly. It has three parts: a server that handles requests, application logic that processes them, and a database that stores data.
@arch
# APIs
An API is the communication bridge between frontend and backend, like a contract that defines how requests and responses look. Read the API documentation to learn each endpoint.
~~~
const res = await fetch('https://example.com/api/users');
const users = await res.json();
~~~
`, 'fetch returns a promise.',
      T('check', 'Fetch data from an API and read it as JSON.', { 'api.js': '// write your code below\n' },
        [['fetch[ ]*[(]', 'Call fetch'], ['[.]json[ ]*[(]', 'Read the JSON response']], 'Array of users')),
  ],
};
