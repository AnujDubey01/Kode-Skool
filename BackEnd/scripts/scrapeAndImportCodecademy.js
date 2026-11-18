const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const https = require('https');
const mongoose = require('mongoose');

const Course = require('../models/Course');
const CourseStruct = require('../models/CourseStruct');
const CourseEnroll = require('../models/CourseEnroll');
const User = require('../models/User');

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/Kodeskool';

const coursesToScrape = [
    { slug: 'learn-python-3', tech: 'Python', faculty: 'Guido van Rossum / Codecademy' },
    { slug: 'introduction-to-javascript', tech: 'JavaScript', faculty: 'Brendan Eich / Codecademy' },
    { slug: 'learn-c-plus-plus', tech: 'C++', faculty: 'Bjarne Stroustrup / Codecademy' },
    { slug: 'learn-java', tech: 'Java', faculty: 'James Gosling / Codecademy' },
    { slug: 'learn-sql', tech: 'SQL', faculty: 'Donald D. Chamberlin / Codecademy' },
    { slug: 'react-101', tech: 'JavaScript', faculty: 'Jordan Walke / Codecademy' },
    { slug: 'learn-typescript', tech: 'TypeScript', faculty: 'Anders Hejlsberg / Codecademy' },
    { slug: 'learn-r', tech: 'R', faculty: 'Ross Ihaka / Codecademy' },
    { slug: 'learn-intermediate-python-3', tech: 'Python', faculty: 'Python Software Foundation / Codecademy' }
];

function fetchCourseTrack(slug) {
    return new Promise((resolve) => {
        const url = `https://www.codecademy.com/learn/${slug}`;
        https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9'
            }
        }, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                const match = data.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
                if (match) {
                    try {
                        const parsed = JSON.parse(match[1]);
                        const track = parsed.props?.pageProps?.track;
                        resolve({ success: true, slug, track });
                    } catch (e) {
                        resolve({ success: false, slug, error: e.message });
                    }
                } else {
                    resolve({ success: false, slug, error: 'No __NEXT_DATA__ found' });
                }
            });
        }).on('error', (err) => resolve({ success: false, slug, error: err.message }));
    });
}

async function run() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB.\n');

        const users = await User.find({});
        console.log(`Found ${users.length} registered users to auto-enroll.\n`);

        for (const item of coursesToScrape) {
            console.log(`[SCRAPING] ${item.slug} (${item.tech})...`);
            const result = await fetchCourseTrack(item.slug);

            if (!result.success || !result.track) {
                console.error(` -> Failed to fetch ${item.slug}:`, result.error);
                continue;
            }

            const track = result.track;
            const courseName = track.title || item.slug;
            const duration = (track.lessonCount || 8) * 2;
            const unitsCount = track.modules?.length || 1;
            const description = track.shortDescription || track.longDescription || `Learn ${item.tech} with interactive coding exercises and real-world projects.`;

            // 1. Upsert Course
            let course = await Course.findOne({ Course_Name: courseName });
            if (!course) {
                course = new Course({
                    Course_Name: courseName,
                    Faculty_Name: item.faculty,
                    Price: 0,
                    Rating: 4.9,
                    Technology: item.tech,
                    Duration: duration,
                    Units: unitsCount,
                    Description: description
                });
                await course.save();
                console.log(` -> Created Course: "${courseName}" (_id: ${course._id})`);
            } else {
                course.Faculty_Name = item.faculty;
                course.Technology = item.tech;
                course.Duration = duration;
                course.Units = unitsCount;
                course.Description = description;
                await course.save();
                console.log(` -> Updated Course: "${courseName}" (_id: ${course._id})`);
            }

            // 2. Build and Upsert CourseStruct
            const unitList = (track.modules || []).map((mod, idx) => {
                const topicList = (mod.contentItems || []).map(ci => ({
                    Topic_Name: `${ci.title}${ci.type ? ' (' + ci.type.toUpperCase() + ')' : ''}`,
                    Video_Link: `https://www.codecademy.com/learn/${item.slug}`,
                    Notes_Link: `https://www.codecademy.com/learn/${item.slug}`
                }));

                // Fallback topic if module has no contentItems listed
                if (topicList.length === 0) {
                    topicList.push({
                        Topic_Name: `${mod.title} - Core Concepts`,
                        Video_Link: `https://www.codecademy.com/learn/${item.slug}`,
                        Notes_Link: `https://www.codecademy.com/learn/${item.slug}`
                    });
                }

                return {
                    Unit_No: idx + 1,
                    Unit_Name: mod.title,
                    Topic_List: topicList
                };
            });

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
            console.log(` -> Saved Course Structure with ${unitList.length} units.`);

            // 3. Auto-enroll users
            for (const user of users) {
                const existingEnroll = await CourseEnroll.findOne({ Std_ID: user._id, Course_ID: course._id });
                if (!existingEnroll) {
                    const newEnroll = new CourseEnroll({
                        Std_ID: user._id,
                        Course_ID: course._id,
                        Status: []
                    });
                    await newEnroll.save();
                }
            }
            console.log(` -> Enrolled users in "${courseName}".\n`);
        }

        console.log('All Codecademy courses scraped, imported, and enrolled successfully!');
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('Fatal error during scrape & import:', err);
        process.exit(1);
    }
}

run();
