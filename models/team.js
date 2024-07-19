import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  name: { type: String, },
  boss: { type: String, },
  wow: { type: String, },
  createdDate: { type: Date, default: Date.now },
  employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
});

export const Team = mongoose.model("Team", teamSchema);
