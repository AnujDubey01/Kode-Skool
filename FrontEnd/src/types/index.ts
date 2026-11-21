
export type UserRole = 'Student' | 'Faculty' | 'Teacher' | 'Admin';

export interface Address {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    pin?: string;
}

export interface Education {
    university_type?: string;
    school_clg_name?: string;
    class_year?: string | number;
}

export interface SocialHandle {
    handle_name: string;
    handle_link: string;
}

export interface UserProfile {
    Name: string;
    Email: string;
    Phone?: string;
    DOB?: string;
    Gender?: string;
    Address?: Address;
    Education?: Education;
    Social_Handles?: SocialHandle[];
}

export interface UpdateProfileData {
    name?: string;
    phone?: string;
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    pin?: string;
    university_type?: string;
    school_clg_name?: string;
    class_year?: number | string;
    dob?: string;
    hacker_rank?: string;
    linkedin?: string;
    codechef?: string;
    instagram?: string;
}

export interface UpdateProfileResponse {
    success: boolean;
    msg: string;
    student?: UserProfile | null;
}

export interface Course {
    _id: string;
    Course_Name: string;
    Course_Description?: string;
    Course_Rating?: number;
}


// Authentication Response Shape
export interface AuthResponse {
    success: boolean;
    msg: string;
    auth_token?: string;
    userType?: UserRole;
    userName?: string;
    email?: string;
    err?: any;
}

// Course Entities
export interface Course {
    _id: string;
    Course_Name: string;
    Faculty_Name?: string;
    Price?: number;
    Rating?: number;
    Technology?: string;
    Duration?: number;
    Units?: number;
    Description?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Topic {
    _id: string;
    Topic_Name: string;
    Video_Link?: string;
    Notes_Link?: string;
    Course_ID?: string;
}

export interface Unit {
    _id?: string;
    Unit_No: number;
    Unit_Name: string;
    Topic_List: Topic[];
}

export interface CourseStruct {
    _id?: string;
    Course_ID: string;
    Unit_List: Unit[];
}

export interface CourseEnrollment {
    _id: string;
    Std_ID: string;
    Course_ID: string | Course;
    Status: string[]; // List of completed topic IDs
    createdAt?: string;
    updatedAt?: string;
}

export interface ActionResponse {
    success: boolean;
    msg?: string;
    error?: string;
}

// ==================== ADMIN TYPES ====================

// 1. Admin Dashboard Stats
export interface AdminStats {
    totalStudents: number;
    totalTeachers: number;
    totalSchools: number;
    totalCourses: number;
    totalEnrollments: number;
    totalResults: number;
    passPercentage: number;
    totalCertifications: number;
}

export interface AdminStatsResponse {
    success: boolean;
    stats: AdminStats;
    msg?: string;
}

// 2. School Setup
export interface SchoolData {
    _id?: string;
    name: string;
    code?: string;
    board?: string;
    email?: string;
    phone?: string;
    address?: string;
    academicYear?: string;
    classes: string[];
}

export interface SchoolResponse {
    success: boolean;
    school: SchoolData;
    msg?: string;
}

// 3. Admin User Listing & Filtering
export interface AdminUser {
    _id: string;
    email: string;
    role: UserRole;
    name: string;
    phone?: string;
    classSection?: string;
    department?: string;
    createdAt?: string;
}

export interface GetUsersParams {
    role?: string;
    search?: string;
    page?: number;
    limit?: number;
}

export interface AdminUsersResponse {
    success: boolean;
    count: number;
    total?: number;
    page?: number;
    totalPages?: number;
    users: AdminUser[];
    msg?: string;
}

// 4. Create Single User
export interface CreateUserPayload {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    classSection?: string;
    department?: string;
    phone?: string;
}

export interface CreateUserResponse {
    success: boolean;
    msg: string;
    user?: {
        _id: string;
        email: string;
        role: string;
        name: string;
    };
}

// 5. Bulk User Import (CSV)
export interface BulkUserItem {
    email: string;
    name: string;
    role?: string;
    password?: string;
    classSection?: string;
    class?: string;
    phone?: string;
}

export interface BulkImportResponse {
    success: boolean;
    msg: string;
    results: {
        successCount: number;
        failedCount: number;
        errors: string[];
    };
}

// 6. Assign Course
export interface AssignCoursePayload {
    courseId: string;
    classSection?: string;
    userEmail?: string;
}

// 7. Academic Reports
export interface AcademicResult {
    _id: string;
    Std_ID?: {
        _id: string;
        Name: string;
        Email: string;
    };
    Test_ID?: {
        _id: string;
        Test_Name?: string;
    };
    Score: number;
    Status: string;
    createdAt?: string;
}

export interface AdminReportsResponse {
    success: boolean;
    totalEnrollments?: number;
    totalResults?: number;
    page?: number;
    limit?: number;
    enrollments: CourseEnrollment[];
    results: AcademicResult[];
    msg?: string;
}

// ==================== TEACHER TYPES ====================

// 1. Teacher Dashboard Overview (/api/teacher/dashboard)
export interface TeacherInfo {
    name: string;
    department: string;
    assignedClasses: string[];
}

export interface TeacherStatsSummary {
    totalClasses: number;
    totalStudents: number;
    totalCourses: number;
    averageScore: number;
    certificatesEligible: number;
}

export interface TeacherClassItem {
    className: string;
    studentsCount: number;
    status: string;
}

export interface TeacherDashboardResponse {
    success: boolean;
    teacher: TeacherInfo;
    stats: TeacherStatsSummary;
    classes: TeacherClassItem[];
    msg?: string;
}

// 2. Student Progress & Support Alerts (/api/teacher/students)
export interface StudentProgress {
    _id: string;
    name: string;
    email: string;
    classSection: string;
    enrolledCourses: string[];
    progress: number;
    latestScore: number;
    needsSupport: boolean;
}

export interface TeacherStudentsResponse {
    success: boolean;
    count: number;
    students: StudentProgress[];
    msg?: string;
}

// 3. Assessment & Test Management (/api/teacher/assessments)
export interface TeacherAssessment {
    _id: string;
    title: string;
    date: string;
    submissions: number;
    averageScore: number;
    status: string;
}

export interface TeacherAssessmentsResponse {
    success: boolean;
    count: number;
    assessments: TeacherAssessment[];
    msg?: string;
}

// ==================== CHATBOT TYPES ====================
export interface ChatMessageData {
    userMessage: string;
    aiResponse: string;
}

export interface ChatResponse {
    success: boolean;
    message: string;
    data?: ChatMessageData;
}

//

export interface AuthContextType {
    token: string | null;
    role: string;
    userName: string;
    isLoggedIn: boolean;
    setUserName: (name: string) => void;
    login: (email: string, password: string) => Promise<AuthResponse>;
    register: (email: string, password: string, name?: string) => Promise<AuthResponse>;
    logout: () => void;
}


// ==================== COMPILER TYPES ====================
export interface ExecuteCodePayload {
    script: string;
    language: string;
    stdin?: string;
}

export interface CompilerResponse {
    success: boolean;
    output?: string;
    error?: string | null;
    statusCode?: number;
    memory?: string | number | null;
    cpuTime?: string | number | null;
    isExecutionSuccess?: boolean;
    message?: string;
}

export interface TechIconProps {
    technology?: string;
    name?: string;
    size?: number;
    className?: string;
}

export interface FooterProps { toggleMode?: string; }

export interface CourseCardBackgroundProps {
    title?: string;
    technology?: string;
}

export interface ContinueLearningProps {
    course?: {
        title?: string;
        progress?: number;
        link?: string;
    };
    lesson?: string;
    progress?: number;
    toggleMode?: string;
}

export interface certificateModalProps {
    studentName: string;
    courseName: string;
    onClose?: () => void;
}

export interface UserActivityItem {
    date: string | Date;
    workTime: string;
}

export interface TimelineProps {
    toggleMode?: string;
    activity?: UserActivityItem[];
}

export interface TestStats {
    testWritten: number;
    overallAvg: number;
    testsTaken: number;
    passed: number;
    failed: number;
    resultWaiting: number;
}

export interface TestSectionProps {
    toggleMode?: string;
    test?: TestStats;
}