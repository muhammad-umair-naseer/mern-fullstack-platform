import mongoose from 'mongoose';


const InternshipApplicationSchema = new mongoose.Schema(
{
name: { type: String, required: true, trim: true },
email: { type: String, required: true, lowercase: true, trim: true },
phone: { type: String, trim: true },
internshipTitle: { type: String, required: true, trim: true },
resumeLink: { type: String, trim: true },
coverLetter: { type: String, trim: true },
},
{ timestamps: true }
);


InternshipApplicationSchema.index({ email: 1, internshipTitle: 1 });


export default mongoose.model('InternshipApplication', InternshipApplicationSchema);