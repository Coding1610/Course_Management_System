import Student from "../model/StudentModel"; 

// Get Student Data Controller
export const getStudentData = async (req, res) => {
    const userId = req.userId;  // userId is set in the verifyToken middleware

    try {
        // Fetch the student data based on userId (can be enrollment, studentId, etc.)
        const student = await Student.findOne({ enrollment: userId }).select('-password');  // Exclude password field if necessary
        
        if (!student) {
            return res.status(404).json({ message: "Student data not found" });
        }

        res.status(200).json(student);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
