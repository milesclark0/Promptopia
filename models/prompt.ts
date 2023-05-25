import {Schema, model, models} from "mongoose";

const PromptSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Creator is required"],
    },
    prompt: {
        type: String,
        required: [true, "Prompt is required"],
    },
    tags: {
        type: [String],
        required: [true, "Tags are required"],
    },
    likes: {
        type: Number,
        default: 0,
    },
});

const Prompt =  models.Prompt || model("Prompt", PromptSchema);

export default Prompt;
