import mongoose,{Schema} from "mongoose"

const storySchema = Schema({
    title: {
        type: String,
    },
    author:{
            type: Schema.Types.ObjectId,
            ref: "User"
    },
    cover:{
        type: String,
        required:true
    },
    isComplete:{
        type: Boolean,
        default: false
    },
    isPublished:{
        type: Boolean,
        default: false
    },
    content:{
        type: String,
        required: true
    },
    chapters:{
        type: Number,
        default: 0
    },
    category:{
        type: String,
        default: ""
    },
    tags:{
        type: Array,
        default: []
    },
    views:{
        type: Number,
        default: 0
    }

},{timestamp:true})

export const Story = mongoose.model('Story',storySchema);