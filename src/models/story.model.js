import mongoose,{Schema} from "mongoose"

const storyCategories = [
    'horror',
    'young-adult',
    'romance',
    'fiction',
    'non-fiction',
    'sci-fiction',
    'paranomal',
    'contemporary',
    'fantasy',
    'supernatural'
]

const storySchema = Schema({
    title: {
        type: String,
        required:true
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
    description:{
        type: String,
        required: true
    },
    chapters:{
        type: Number,
        default: 0
    },
    category:{
        type: Schema.Types.ObjectId,
        ref: "Category"
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