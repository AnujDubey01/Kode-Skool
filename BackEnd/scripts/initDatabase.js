const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Course = require('../models/Course');
const CourseStruct = require('../models/CourseStruct');
const CourseEnroll = require('../models/CourseEnroll');

const rawMongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/Kodeskool';
const mongoUri = rawMongoUri.trim();

const coursesCatalog = [
    {
        name: 'Learn Python 3',
        tech: 'Python',
        faculty: 'Guido van Rossum / Codecademy',
        duration: 25,
        rating: 4.8,
        price: 0,
        description: 'Learn the fundamentals of Python 3, one of the most versatile and beginner-friendly programming languages used in data science, web development, and automation.',
        units: [
            {
                unitNo: 1,
                unitName: 'Syntax and Variables',
                topics: [
                    { name: 'Welcome to Python 3', video: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc', notes: 'https://docs.python.org/3/tutorial/' },
                    { name: 'Variables & Data Types', video: 'https://www.youtube.com/watch?v=khKv-8q7YmY', notes: 'https://docs.python.org/3/tutorial/introduction.html' },
                    { name: 'Arithmetic & Modulo Operations', video: 'https://www.youtube.com/watch?v=kqtD5dpn9C8', notes: 'https://docs.python.org/3/reference/expressions.html' }
                ]
            },
            {
                unitNo: 2,
                unitName: 'Control Flow & Conditionals',
                topics: [
                    { name: 'Boolean Logic & Operators', video: 'https://www.youtube.com/watch?v=9OK32jb_TdI', notes: 'https://docs.python.org/3/library/stdtypes.html#boolean-operations' },
                    { name: 'If, Elif, and Else Statements', video: 'https://www.youtube.com/watch?v=DZwmZ8Usvnk', notes: 'https://docs.python.org/3/tutorial/controlflow.html' }
                ]
            },
            {
                unitNo: 3,
                unitName: 'Lists and Loops',
                topics: [
                    { name: 'Working with Python Lists', video: 'https://www.youtube.com/watch?v=ohCDWZgNIU0', notes: 'https://docs.python.org/3/tutorial/datastructures.html' },
                    { name: 'For Loops and While Loops', video: 'https://www.youtube.com/watch?v=6iF8Xb7Z3wQ', notes: 'https://docs.python.org/3/tutorial/controlflow.html#for-statements' },
                    { name: 'List Comprehensions', video: 'https://www.youtube.com/watch?v=3dt4xAU3b40', notes: 'https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions' }
                ]
            },
            {
                unitNo: 4,
                unitName: 'Functions and Modules',
                topics: [
                    { name: 'Defining and Calling Functions', video: 'https://www.youtube.com/watch?v=9Os0o3wzS_I', notes: 'https://docs.python.org/3/tutorial/controlflow.html#defining-functions' },
                    { name: 'Variable Scope and Return Values', video: 'https://www.youtube.com/watch?v=QVdf0LgmICw', notes: 'https://docs.python.org/3/tutorial/classes.html#python-scopes-and-namespaces' },
                    { name: 'Importing Built-in Modules', video: 'https://www.youtube.com/watch?v=CqvZ3vGoGs0', notes: 'https://docs.python.org/3/tutorial/modules.html' }
                ]
            }
        ]
    },
    {
        name: 'Learn JavaScript',
        tech: 'JavaScript',
        faculty: 'Brendan Eich / Codecademy',
        duration: 20,
        rating: 4.7,
        price: 0,
        description: 'Master JavaScript from basic variables and functions to modern ES6+ concepts and DOM manipulation for interactive modern web apps.',
        units: [
            {
                unitNo: 1,
                unitName: 'JavaScript Fundamentals',
                topics: [
                    { name: 'Variables (let, const, var)', video: 'https://www.youtube.com/watch?v=W6NZfCO5SIk', notes: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types' },
                    { name: 'Conditionals & Ternary Operator', video: 'https://www.youtube.com/watch?v=IsG4Xd6LlsM', notes: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling' },
                    { name: 'Arrow Functions & Closures', video: 'https://www.youtube.com/watch?v=h33Srr5J9nY', notes: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions' }
                ]
            },
            {
                unitNo: 2,
                unitName: 'Arrays & Object Manipulation',
                topics: [
                    { name: 'Arrays & Modern Iterators (.map, .filter)', video: 'https://www.youtube.com/watch?v=rRgD1yVwIvE', notes: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array' },
                    { name: 'Objects, Destructuring & Spread', video: 'https://www.youtube.com/watch?v=-vR3aJVnZK8', notes: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects' }
                ]
            },
            {
                unitNo: 3,
                unitName: 'Asynchronous JavaScript & Promises',
                topics: [
                    { name: 'Callbacks and Event Loop', video: 'https://www.youtube.com/watch?v=8aGhZQkoFbQ', notes: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop' },
                    { name: 'Promises and Async / Await', video: 'https://www.youtube.com/watch?v=PoRJizFvM7s', notes: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function' },
                    { name: 'Fetching Data with Fetch API', video: 'https://www.youtube.com/watch?v=cuEtnrL9-H0', notes: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API' }
                ]
            }
        ]
    },
    {
        name: 'Learn C++',
        tech: 'C++',
        faculty: 'Bjarne Stroustrup / Codecademy',
        duration: 22,
        rating: 4.6,
        price: 0,
        description: 'Explore the speed and flexibility of C++, from variables and loops to object-oriented programming, memory management, and pointers.',
        units: [
            {
                unitNo: 1,
                unitName: 'Introduction to C++',
                topics: [
                    { name: 'Hello World & Compiling with g++', video: 'https://www.youtube.com/watch?v=vLnPwxZdW4Y', notes: 'https://en.cppreference.com/w/cpp' },
                    { name: 'Variables & User Input (cin/cout)', video: 'https://www.youtube.com/watch?v=rubgC1e1vG8', notes: 'https://en.cppreference.com/w/cpp/io/cin' },
                    { name: 'Conditionals & Logical Operators', video: 'https://www.youtube.com/watch?v=AY96XFqb934', notes: 'https://en.cppreference.com/w/cpp/language/if' }
                ]
            },
            {
                unitNo: 2,
                unitName: 'Pointers & Memory Architecture',
                topics: [
                    { name: 'Pointers & Address-of Operator (&)', video: 'https://www.youtube.com/watch?v=2ybLDQagrUM', notes: 'https://en.cppreference.com/w/cpp/language/pointer' },
                    { name: 'References vs Pointers', video: 'https://www.youtube.com/watch?v=IzoFn3dfsPA', notes: 'https://en.cppreference.com/w/cpp/language/reference' },
                    { name: 'Dynamic Memory (new / delete)', video: 'https://www.youtube.com/watch?v=5U_qZ8jVzD8', notes: 'https://en.cppreference.com/w/cpp/memory/new' }
                ]
            },
            {
                unitNo: 3,
                unitName: 'Object Oriented Programming in C++',
                topics: [
                    { name: 'Classes, Objects, and Access Specifiers', video: 'https://www.youtube.com/watch?v=ABRP_5RYhqU', notes: 'https://en.cppreference.com/w/cpp/language/classes' },
                    { name: 'Constructors, Destructors & Encapsulation', video: 'https://www.youtube.com/watch?v=48H3Y5nQn4U', notes: 'https://en.cppreference.com/w/cpp/language/constructor' },
                    { name: 'Inheritance and Polymorphism', video: 'https://www.youtube.com/watch?v=wKby_bW2H7Q', notes: 'https://en.cppreference.com/w/cpp/language/derived_class' }
                ]
            }
        ]
    },
    {
        name: 'Learn Java',
        tech: 'Java',
        faculty: 'James Gosling / Codecademy',
        duration: 24,
        rating: 4.7,
        price: 0,
        description: 'Dive into Java syntax, object-oriented concepts, exception handling, and data structures used across enterprise and Android applications.',
        units: [
            {
                unitNo: 1,
                unitName: 'Java Fundamentals',
                topics: [
                    { name: 'JVM, JDK, and First Java Program', video: 'https://www.youtube.com/watch?v=eIrMbAQSU34', notes: 'https://docs.oracle.com/en/java/' },
                    { name: 'Data Types, Operators, and Expressions', video: 'https://www.youtube.com/watch?v=WPvGqX-TXP0', notes: 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html' },
                    { name: 'Control Flow (if, switch, while, for)', video: 'https://www.youtube.com/watch?v=0h9Vp1X_0kM', notes: 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/flow.html' }
                ]
            },
            {
                unitNo: 2,
                unitName: 'Object-Oriented Java',
                topics: [
                    { name: 'Classes, Methods, and Instance Variables', video: 'https://www.youtube.com/watch?v=iu-l4UvW9f8', notes: 'https://docs.oracle.com/javase/tutorial/java/javaOO/classes.html' },
                    { name: 'Inheritance and Interfaces', video: 'https://www.youtube.com/watch?v=4Gde4C3F0Q8', notes: 'https://docs.oracle.com/javase/tutorial/java/IandI/createinterface.html' }
                ]
            }
        ]
    },
    {
        name: 'Learn SQL',
        tech: 'SQL',
        faculty: 'Donald D. Chamberlin / Codecademy',
        duration: 12,
        rating: 4.8,
        price: 0,
        description: 'Master relational database querying using SQL: SELECT, WHERE, aggregates, multiple table JOINs, subqueries, and table schema design.',
        units: [
            {
                unitNo: 1,
                unitName: 'Queries and Filtering',
                topics: [
                    { name: 'SELECT, DISTINCT, and WHERE Clauses', video: 'https://www.youtube.com/watch?v=HXV3zeRR3h4', notes: 'https://www.postgresql.org/docs/current/queries-table-expressions.html' },
                    { name: 'LIKE, BETWEEN, AND, and OR Conditions', video: 'https://www.youtube.com/watch?v=7S_tz1z_5bA', notes: 'https://www.postgresql.org/docs/current/functions-matching.html' },
                    { name: 'ORDER BY and LIMIT', video: 'https://www.youtube.com/watch?v=9PZj730viBU', notes: 'https://www.postgresql.org/docs/current/queries-order.html' }
                ]
            },
            {
                unitNo: 2,
                unitName: 'Aggregates & Grouping',
                topics: [
                    { name: 'COUNT, SUM, AVG, MIN, and MAX', video: 'https://www.youtube.com/watch?v=Z_kmlgX6Wk4', notes: 'https://www.postgresql.org/docs/current/functions-aggregate.html' },
                    { name: 'GROUP BY and HAVING Clauses', video: 'https://www.youtube.com/watch?v=3u_K74CgH4g', notes: 'https://www.postgresql.org/docs/current/queries-table-expressions.html#QUERIES-GROUP' }
                ]
            },
            {
                unitNo: 3,
                unitName: 'Multi-Table Queries with JOINs',
                topics: [
                    { name: 'INNER JOIN vs LEFT / RIGHT JOIN', video: 'https://www.youtube.com/watch?v=2HVMiPPuPIM', notes: 'https://www.postgresql.org/docs/current/tutorial-join.html' },
                    { name: 'Primary Keys, Foreign Keys & Normalization', video: 'https://www.youtube.com/watch?v=GFQaEYEc8_8', notes: 'https://www.postgresql.org/docs/current/ddl-constraints.html' }
                ]
            }
        ]
    },
    {
        name: 'Learn React',
        tech: 'JavaScript',
        faculty: 'Jordan Walke / Codecademy',
        duration: 18,
        rating: 4.9,
        price: 0,
        description: 'Build fast, responsive Single Page Applications with React: JSX, functional components, hooks (useState, useEffect), and component architecture.',
        units: [
            {
                unitNo: 1,
                unitName: 'React Fundamentals',
                topics: [
                    { name: 'JSX & Component-Based Architecture', video: 'https://www.youtube.com/watch?v=SqcY0GlETPk', notes: 'https://react.dev/learn/describing-the-ui' },
                    { name: 'Props and Component Composition', video: 'https://www.youtube.com/watch?v=m7OWXtbiXX8', notes: 'https://react.dev/learn/passing-props-to-a-component' },
                    { name: 'State Management with useState', video: 'https://www.youtube.com/watch?v=O6P86uwfdR0', notes: 'https://react.dev/reference/react/useState' }
                ]
            },
            {
                unitNo: 2,
                unitName: 'Side Effects and Hooks',
                topics: [
                    { name: 'useEffect & Component Lifecycle', video: 'https://www.youtube.com/watch?v=0ZJgIjIuY7U', notes: 'https://react.dev/reference/react/useEffect' },
                    { name: 'Handling Forms & Controlled Inputs', video: 'https://www.youtube.com/watch?v=7Vo_VCcWupQ', notes: 'https://react.dev/reference/react-dom/components/input' },
                    { name: 'React Context API for Global State', video: 'https://www.youtube.com/watch?v=5LrDIWkK_Bc', notes: 'https://react.dev/learn/passing-data-deeply-with-context' }
                ]
            }
        ]
    },
    {
        name: 'Learn TypeScript',
        tech: 'TypeScript',
        faculty: 'Anders Hejlsberg / Codecademy',
        duration: 16,
        rating: 4.8,
        price: 0,
        description: 'Add static typing and compile-time safety to JavaScript projects with TypeScript: interfaces, type aliases, union types, and generics.',
        units: [
            {
                unitNo: 1,
                unitName: 'TypeScript Basics',
                topics: [
                    { name: 'Type Annotations & Primitive Types', video: 'https://www.youtube.com/watch?v=ahCwqrYpIuM', notes: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html' },
                    { name: 'Type Aliases vs Interfaces', video: 'https://www.youtube.com/watch?v=zQnYY4Gk83s', notes: 'https://www.typescriptlang.org/docs/handbook/2/objects.html' },
                    { name: 'Union, Literal & Any Types', video: 'https://www.youtube.com/watch?v=vB7zXpZ4-vY', notes: 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html' }
                ]
            },
            {
                unitNo: 2,
                unitName: 'Generics and Advanced Types',
                topics: [
                    { name: 'Generic Functions and Interfaces', video: 'https://www.youtube.com/watch?v=nViEqpgwxHE', notes: 'https://www.typescriptlang.org/docs/handbook/2/generics.html' },
                    { name: 'Utility Types (Partial, Pick, Omit)', video: 'https://www.youtube.com/watch?v=3i_E8N7bX7I', notes: 'https://www.typescriptlang.org/docs/handbook/utility-types.html' }
                ]
            }
        ]
    },
    {
        name: 'Learn R',
        tech: 'R',
        faculty: 'Ross Ihaka / Codecademy',
        duration: 15,
        rating: 4.5,
        price: 0,
        description: 'Explore statistical computing, data wrangling with dplyr, and publication-ready data visualization using ggplot2 in R.',
        units: [
            {
                unitNo: 1,
                unitName: 'R Syntax and Data Structures',
                topics: [
                    { name: 'Vectors, Factors, and Data Frames', video: 'https://www.youtube.com/watch?v=_V8eKsto3Ug', notes: 'https://cran.r-project.org/doc/manuals/r-release/R-intro.html' },
                    { name: 'Data Manipulation with dplyr', video: 'https://www.youtube.com/watch?v=aywZrzNaKjs', notes: 'https://dplyr.tidyverse.org/' },
                    { name: 'Data Visualization with ggplot2', video: 'https://www.youtube.com/watch?v=h29g21z0a68', notes: 'https://ggplot2.tidyverse.org/' }
                ]
            }
        ]
    },
    {
        name: 'Learn Intermediate Python 3',
        tech: 'Python',
        faculty: 'Python Software Foundation / Codecademy',
        duration: 20,
        rating: 4.8,
        price: 0,
        description: 'Advance your Python mastery with object-oriented programming, lambda functions, iterators, generators, decorators, and context managers.',
        units: [
            {
                unitNo: 1,
                unitName: 'Advanced Python Concepts',
                topics: [
                    { name: 'Decorators and Higher-Order Functions', video: 'https://www.youtube.com/watch?v=FsAPt_9Bf3U', notes: 'https://docs.python.org/3/glossary.html#term-decorator' },
                    { name: 'Generators and the yield Statement', video: 'https://www.youtube.com/watch?v=bD05uGo_sVI', notes: 'https://docs.python.org/3/howto/functional.html#generators' },
                    { name: 'Context Managers and the with Statement', video: 'https://www.youtube.com/watch?v=-aKFBoZpiqA', notes: 'https://docs.python.org/3/reference/datamodel.html#context-managers' }
                ]
            }
        ]
    }
];

async function seed() {
    try {
        console.log('====================================================');
        console.log('  Kode-Skool Database Initialization & Seeding');
        console.log('====================================================\n');
        console.log(`Connecting to MongoDB URI:\n  ${mongoUri.replace(/:([^@]+)@/, ':****@')}\n`);

        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB successfully!\n');

        const salt = await bcrypt.genSalt(10);

        // 1. Seed Admin
        console.log('[1/4] Setting up Admin Account...');
        const adminEmail = 'admin@kodeskool.com';
        const adminPassword = 'Admin@123';
        const hashedAdminPass = await bcrypt.hash(adminPassword, salt);
        let adminUser = await User.findOne({ Email: adminEmail });
        if (!adminUser) {
            adminUser = new User({
                Email: adminEmail,
                Password: hashedAdminPass,
                User_Type: 'Admin'
            });
            await adminUser.save();
            console.log(`  -> Created Admin: ${adminEmail}`);
        } else {
            adminUser.Password = hashedAdminPass;
            adminUser.User_Type = 'Admin';
            await adminUser.save();
            console.log(`  -> Updated Admin: ${adminEmail}`);
        }

        // 2. Seed Teacher
        console.log('\n[2/4] Setting up Faculty / Teacher Account...');
        const teacherEmail = 'teacher@kodeskool.com';
        const teacherPassword = 'Teacher@123';
        const hashedTeacherPass = await bcrypt.hash(teacherPassword, salt);
        let teacherProfile = await Teacher.findOne({ Email: teacherEmail });
        if (!teacherProfile) {
            teacherProfile = new Teacher({
                Name: 'Demo Teacher',
                Email: teacherEmail,
                Department: 'Computer Science',
                AssignedClasses: ['Class 9', 'Class 10', 'Class 11']
            });
            await teacherProfile.save();
        }

        let teacherUser = await User.findOne({ Email: teacherEmail });
        if (!teacherUser) {
            teacherUser = new User({
                Email: teacherEmail,
                Password: hashedTeacherPass,
                User_Type: 'Faculty',
                User_Data: teacherProfile._id
            });
            await teacherUser.save();
            console.log(`  -> Created Teacher: ${teacherEmail}`);
        } else {
            teacherUser.Password = hashedTeacherPass;
            teacherUser.User_Type = 'Faculty';
            teacherUser.User_Data = teacherProfile._id;
            await teacherUser.save();
            console.log(`  -> Updated Teacher: ${teacherEmail}`);
        }

        // 3. Seed Demo Student
        console.log('\n[3/4] Setting up Demo Student Account...');
        const studentEmail = 'student@kodeskool.com';
        const studentPassword = 'Student@123';
        const hashedStudentPass = await bcrypt.hash(studentPassword, salt);
        let studentProfile = await Student.findOne({ Email: studentEmail });
        if (!studentProfile) {
            studentProfile = new Student({
                Name: 'Anuj Dubey',
                Email: studentEmail,
                ClassSection: '10-A',
                Address: {
                    city: 'Delhi',
                    state: 'Delhi',
                    country: 'India',
                    pin: '110001'
                },
                Education: {
                    university_type: 'School',
                    school_clg_name: 'Kode-Skool Academy',
                    class_year: 10
                }
            });
            await studentProfile.save();
        }

        let studentUser = await User.findOne({ Email: studentEmail });
        if (!studentUser) {
            studentUser = new User({
                Email: studentEmail,
                Password: hashedStudentPass,
                User_Type: 'Student',
                User_Data: studentProfile._id
            });
            await studentUser.save();
            console.log(`  -> Created Student: ${studentEmail}`);
        } else {
            studentUser.Password = hashedStudentPass;
            studentUser.User_Type = 'Student';
            studentUser.User_Data = studentProfile._id;
            await studentUser.save();
            console.log(`  -> Updated Student: ${studentEmail}`);
        }

        // 4. Seed Courses and Syllabi
        console.log('\n[4/4] Importing 9 Core Courses & Syllabus Units...');
        const createdCourses = [];

        for (const c of coursesCatalog) {
            let course = await Course.findOne({ Course_Name: c.name });
            if (!course) {
                course = new Course({
                    Course_Name: c.name,
                    Faculty_Name: c.faculty,
                    Price: c.price,
                    Duration: c.duration,
                    Description: c.description,
                    Technology: c.tech,
                    Rating: c.rating,
                    Total_Students: Math.floor(Math.random() * 200) + 50
                });
                await course.save();
                console.log(`  -> Created Course: ${c.name} (${c.tech})`);
            } else {
                course.Technology = c.tech;
                course.Rating = c.rating;
                course.Description = c.description;
                await course.save();
            }

            createdCourses.push(course);

            // Structure
            const unitList = c.units.map(u => ({
                Unit_No: u.unitNo,
                Unit_Name: u.unitName,
                Topic_List: u.topics.map(t => ({
                    Topic_Name: t.name,
                    Video_Link: t.video,
                    Notes_Link: t.notes
                }))
            }));

            let struct = await CourseStruct.findOne({ Course_ID: course._id });
            if (!struct) {
                struct = new CourseStruct({
                    Course_ID: course._id,
                    Unit_List: unitList
                });
            } else {
                struct.Unit_List = unitList;
            }
            await struct.save();

            // Auto-enroll the demo student in first 3 courses
            const isInitialEnrolled = ['Learn Python 3', 'Learn JavaScript', 'Learn C++'].includes(c.name);
            let enroll = await CourseEnroll.findOne({ Std_ID: studentUser._id, Course_ID: course._id });
            if (!enroll && isInitialEnrolled) {
                // give completed topics so progress circle has initial percentage
                const firstTopicId = struct.Unit_List[0]?.Topic_List[0]?._id;
                enroll = new CourseEnroll({
                    Std_ID: studentUser._id,
                    Course_ID: course._id,
                    Status: firstTopicId ? [firstTopicId] : []
                });
                await enroll.save();
            }
        }

        console.log('\n====================================================');
        console.log('  Database Seeding Completed Successfully!           ');
        console.log('====================================================');
        console.log('\nDemo Accounts Created & Ready:');
        console.log('  1. Student Account:');
        console.log('     Email:    student@kodeskool.com');
        console.log('     Password: Student@123');
        console.log('     Name:     Anuj Dubey');
        console.log('');
        console.log('  2. Teacher Account:');
        console.log('     Email:    teacher@kodeskool.com');
        console.log('     Password: Teacher@123');
        console.log('     Name:     Demo Teacher');
        console.log('');
        console.log('  3. Admin Account:');
        console.log('     Email:    admin@kodeskool.com');
        console.log('     Password: Admin@123');
        console.log('     Role:     Admin');
        console.log('====================================================\n');

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('Database seeding failed:', err);
        process.exit(1);
    }
}

seed();
