// Notes whiel building this project
// -------------------How to set up typescript for express ---------------------------------
//1. Download ts-node , types/node and types/express as dev depencencies
// 2. create tscinfig on root , module - es, root dir -> src and output-> dist
// 3. for dev script -> node tsc src/index.ts , build -> tsc (compies to js and throws dist/index.js file along with other files), start -> node index.js
// 4. install nodemon and dotenv for env vars and hot reloading and get change dev script
// 5. to use typescriot with nodemon you have to get it from chat gpt and change the tsconfig as well to import directly from ts files,
// "dev": "nodemon --watch src --ext ts --exec \"node --loader ts-node/esm src/index.ts\"", now dev becomes this long
// 6. the build is now tsc -p tscongif.build.json and start is same
// 7. you have to give extensions i do not know why, due to ts configs

// ------------------------- Midddleware -------------------
