import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Course from './models/Course.js';
import University from './models/University.js';

dotenv.config();

const testDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected Successfully');

        // Test User Creation
        console.log('\nTesting User Creation...');
        const testUser = await User.create({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            role: 'student'
        });
        console.log('✅ User Created:', testUser.name);

        // Test University Creation
        console.log('\nTesting University Creation...');
        const testUniversity = await University.create({
            name: 'Test University',
            description: 'A test university',
            location: {
                city: 'Test City',
                country: 'Test Country'
            }
        });
        console.log('✅ University Created:', testUniversity.name);

        // Test Course Creation
        console.log('\nTesting Course Creation...');
        const testCourse = await Course.create({
            title: 'Test Course',
            description: 'A test course',
            instructor: testUser._id,
            university: testUniversity._id,
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            price: 99.99
        });
        console.log('✅ Course Created:', testCourse.title);

        // Test Reading Data
        console.log('\nTesting Data Retrieval...');
        const users = await User.find({});
        const universities = await University.find({});
        const courses = await Course.find({});
        console.log('✅ Users found:', users.length);
        console.log('✅ Universities found:', universities.length);
        console.log('✅ Courses found:', courses.length);

        // Test Updating Data
        console.log('\nTesting Data Update...');
        const updatedUser = await User.findByIdAndUpdate(
            testUser._id,
            { name: 'Updated Test User' },
            { new: true }
        );
        console.log('✅ User Updated:', updatedUser.name);

        // Test Deleting Data
        console.log('\nTesting Data Deletion...');
        await User.findByIdAndDelete(testUser._id);
        await University.findByIdAndDelete(testUniversity._id);
        await Course.findByIdAndDelete(testCourse._id);
        console.log('✅ Test Data Cleaned Up');

        console.log('\n🎉 All Database Tests Completed Successfully!');
    } catch (error) {
        console.error('❌ Error during testing:', error);
    } finally {
        // Close the database connection
        await mongoose.connection.close();
        console.log('\nDatabase connection closed');
    }
};

// Run the tests
testDatabase(); 