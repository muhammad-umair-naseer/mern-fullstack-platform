import mongoose from 'mongoose';


const CourseRegistrationSchema = new mongoose.Schema(
{
name: { type: String, required: true, trim: true },
email: { type: String, required: true, lowercase: true, trim: true },
phone: { type: String, trim: true },
courseTitle: { type: String, required: true, trim: true },
level: { type: String, trim: true },
notes: { type: String, trim: true },
},
{ timestamps: true }
);


CourseRegistrationSchema.index({ email: 1, courseTitle: 1 });


export default mongoose.model('CourseRegistration', CourseRegistrationSchema);